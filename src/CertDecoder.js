import React, { useState } from 'react';

const CertDecoder = () => {
  const [cert, setCert] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState('');

  const parseX509Certificate = (bytes) => {
    let pos = 0;

    const readTagLength = () => {
      const tag = bytes[pos++];
      let length = bytes[pos++];
      
      if (length & 0x80) {
        const numBytes = length & 0x7f;
        length = 0;
        for (let i = 0; i < numBytes; i++) {
          length = (length << 8) | bytes[pos++];
        }
      }
      return { tag, length };
    };

    const readBytes = (length) => {
      const result = bytes.slice(pos, pos + length);
      pos += length;
      return result;
    };

    const bytesToString = (b) => {
      return Array.from(b).map(byte => String.fromCharCode(byte)).join('');
    };

    const bytesToHex = (b) => {
      return Array.from(b).map(byte => byte.toString(16).padStart(2, '0')).join(':').toUpperCase();
    };

    const parseOID = (b) => {
      const oid = [Math.floor(b[0] / 40), b[0] % 40];
      let value = 0;
      for (let i = 1; i < b.length; i++) {
        value = (value << 7) | (b[i] & 0x7f);
        if (!(b[i] & 0x80)) {
          oid.push(value);
          value = 0;
        }
      }
      return oid.join('.');
    };

    const parseDate = (timeBytes) => {
      const timeStr = bytesToString(timeBytes);
      let year, month, day, hour, minute, second;
      
      if (timeBytes.length === 13) {
        year = parseInt(timeStr.substr(0, 2));
        year += (year >= 50) ? 1900 : 2000;
        month = parseInt(timeStr.substr(2, 2));
        day = parseInt(timeStr.substr(4, 2));
        hour = parseInt(timeStr.substr(6, 2));
        minute = parseInt(timeStr.substr(8, 2));
        second = parseInt(timeStr.substr(10, 2));
      } else {
        year = parseInt(timeStr.substr(0, 4));
        month = parseInt(timeStr.substr(4, 2));
        day = parseInt(timeStr.substr(6, 2));
        hour = parseInt(timeStr.substr(8, 2));
        minute = parseInt(timeStr.substr(10, 2));
        second = parseInt(timeStr.substr(12, 2));
      }
      
      return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    };

    const parseDN = () => {
      const dn = {};
      const { length: seqLen } = readTagLength();
      const endPos = pos + seqLen;
      
      while (pos < endPos) {
        readTagLength();
        readTagLength();
        const { length: oidLen } = readTagLength();
        const oid = parseOID(readBytes(oidLen));
        const { length: valLen } = readTagLength();
        const value = bytesToString(readBytes(valLen));
        
        const oidMap = {
          '2.5.4.3': 'CN',
          '2.5.4.10': 'O',
          '2.5.4.11': 'OU',
          '2.5.4.6': 'C',
          '2.5.4.7': 'L',
          '2.5.4.8': 'ST'
        };
        
        if (oidMap[oid]) {
          dn[oidMap[oid]] = value;
        }
      }
      
      return Object.entries(dn).map(([k, v]) => `${k}=${v}`).join(', ');
    };

    readTagLength();
    readTagLength();
    
    if (bytes[pos] === 0xa0) {
      readTagLength();
      readTagLength();
      pos++;
    }
    
    const { length: serialLen } = readTagLength();
    const serialNumber = bytesToHex(readBytes(serialLen));
    
    readTagLength();
    const { length: sigOidLen } = readTagLength();
    readBytes(sigOidLen);
    if (bytes[pos] === 0x05) readTagLength();
    
    const issuer = parseDN();
    
    readTagLength();
    const { length: notBeforeLen } = readTagLength();
    const notBefore = parseDate(readBytes(notBeforeLen));
    const { length: notAfterLen } = readTagLength();
    const notAfter = parseDate(readBytes(notAfterLen));
    
    const subject = parseDN();
    
    const { length: spkiLen } = readTagLength();
    const spkiStart = pos;
    
    readTagLength();
    const { length: pkOidLen } = readTagLength();
    const pkOid = parseOID(readBytes(pkOidLen));
    if (bytes[pos] === 0x05) readTagLength();
    if (bytes[pos] === 0x06) {
      const { length: curveOidLen } = readTagLength();
      readBytes(curveOidLen);
    }
    
    const { length: pubKeyLen } = readTagLength();
    pos++;
    readBytes(pubKeyLen - 1);
    
    const spkiBytes = bytes.slice(spkiStart, spkiStart + spkiLen);
    const pubKeyB64 = btoa(String.fromCharCode(...spkiBytes));
    const pubKeyPem = '-----BEGIN PUBLIC KEY-----\n' + 
                      pubKeyB64.match(/.{1,64}/g).join('\n') + 
                      '\n-----END PUBLIC KEY-----';
    
    const pkAlgorithm = pkOid === '1.2.840.113549.1.1.1' ? 'RSA' : 
                       pkOid === '1.2.840.10045.2.1' ? 'EC' : 'Unknown';
    
    let sans = [];
    try {
      while (pos < bytes.length - 10 && bytes[pos] !== 0xa3) {
        const { length: skipLen } = readTagLength();
        readBytes(skipLen);
      }
      
      if (bytes[pos] === 0xa3) {
        readTagLength();
        readTagLength();
        
        while (pos < bytes.length - 10) {
          const { length: extSeqLen } = readTagLength();
          const endPos = pos + extSeqLen;
          
          const { length: extOidLen } = readTagLength();
          const extOid = parseOID(readBytes(extOidLen));
          
          if (bytes[pos] === 0x01) {
            readTagLength();
            pos++;
          }
          
          const { length: extValLen } = readTagLength();
          
          if (extOid === '2.5.29.17') {
            readTagLength();
            while (pos < endPos) {
              const sanTag = bytes[pos++];
              const sanLen = bytes[pos++];
              const sanValue = bytesToString(readBytes(sanLen));
              
              if (sanTag === 0x82) {
                sans.push({ type: 'DNS', value: sanValue });
              } else if (sanTag === 0x87) {
                sans.push({ type: 'IP', value: Array.from(readBytes(sanLen)).join('.') });
              }
            }
            break;
          } else {
            readBytes(extValLen);
          }
          
          pos = endPos;
        }
      }
    } catch (e) {
      // Extensions parsing failed
    }
    
    const now = new Date();
    const daysUntilExpiry = Math.floor((notAfter - now) / (1000 * 60 * 60 * 24));
    const isExpired = now > notAfter;
    const isNotYetValid = now < notBefore;
    
    return {
      serialNumber,
      subject,
      issuer,
      notBefore: notBefore.toUTCString(),
      notAfter: notAfter.toUTCString(),
      daysUntilExpiry,
      isExpired,
      isNotYetValid,
      publicKeyAlgorithm: pkAlgorithm,
      publicKeyPem: pubKeyPem,
      subjectAlternativeNames: sans
    };
  };

  const decodeCert = () => {
    try {
      let certData = cert.trim();
      certData = certData.replace(/-----BEGIN CERTIFICATE-----/g, '')
                        .replace(/-----END CERTIFICATE-----/g, '')
                        .replace(/\s/g, '');

      const binaryString = atob(certData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const certInfo = parseX509Certificate(bytes);
      setDecoded(certInfo);
      setError('');
    } catch (e) {
      setError('Error decoding certificate: ' + e.message);
      setDecoded(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Certificate Decoder</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Certificate (PEM format)
        </label>
        <textarea
          value={cert}
          onChange={(e) => setCert(e.target.value)}
          className="w-full h-48 px-4 py-3 border border-gray-300 rounded-md font-mono text-sm resize-none"
          placeholder="-----BEGIN CERTIFICATE-----&#10;MIIDXTCCAkWgAwIBAgIJAKL...&#10;-----END CERTIFICATE-----"
        />
        <button
          onClick={decodeCert}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Decode Certificate
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {decoded && (
        <div className="space-y-6">
          <div className={`rounded-lg p-4 ${
            decoded.isExpired ? 'bg-red-50 border border-red-200' :
            decoded.isNotYetValid ? 'bg-yellow-50 border border-yellow-200' :
            decoded.daysUntilExpiry < 30 ? 'bg-orange-50 border border-orange-200' :
            'bg-green-50 border border-green-200'
          }`}>
            <h3 className="font-semibold text-lg mb-2">
              {decoded.isExpired ? '❌ Certificate Expired' :
               decoded.isNotYetValid ? '⚠️ Not Yet Valid' :
               decoded.daysUntilExpiry < 30 ? '⚠️ Expiring Soon' :
               '✅ Certificate Valid'}
            </h3>
            {!decoded.isExpired && !decoded.isNotYetValid && (
              <p className="text-sm">
                Expires in <strong>{decoded.daysUntilExpiry}</strong> days
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Certificate Information</h3>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <span className="font-medium text-gray-700">Serial Number:</span>
                <p className="mt-1 font-mono text-sm text-gray-600 break-all">{decoded.serialNumber}</p>
              </div>
              
              <div className="border-b pb-3">
                <span className="font-medium text-gray-700">Subject:</span>
                <p className="mt-1 text-gray-600">{decoded.subject}</p>
              </div>
              
              <div className="border-b pb-3">
                <span className="font-medium text-gray-700">Issuer:</span>
                <p className="mt-1 text-gray-600">{decoded.issuer}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 border-b pb-3">
                <div>
                  <span className="font-medium text-gray-700">Valid From:</span>
                  <p className="mt-1 text-gray-600 text-sm">{decoded.notBefore}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Valid Until:</span>
                  <p className="mt-1 text-gray-600 text-sm">{decoded.notAfter}</p>
                </div>
              </div>
              
              <div className="border-b pb-3">
                <span className="font-medium text-gray-700">Public Key Algorithm:</span>
                <p className="mt-1 text-gray-600">{decoded.publicKeyAlgorithm}</p>
              </div>
            </div>
          </div>

          {decoded.subjectAlternativeNames && decoded.subjectAlternativeNames.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Subject Alternative Names (SANs)</h3>
              <div className="space-y-2">
                {decoded.subjectAlternativeNames.map((san, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium">
                      {san.type}
                    </span>
                    <span className="text-gray-700 font-mono text-sm">{san.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Public Key (PEM Format)</h3>
              <button
                onClick={() => navigator.clipboard.writeText(decoded.publicKeyPem)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                Copy Public Key
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-xs border border-gray-200 font-mono">
              {decoded.publicKeyPem}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertDecoder;