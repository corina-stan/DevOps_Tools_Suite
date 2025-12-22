import React, { useState, useEffect } from 'react';

const HashGenerator = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });

  useEffect(() => {
    if (input) {
      generateHashes(input);
    } else {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
    }
  }, [input]);

  const generateHashes = async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    try {
      // Generate SHA hashes using Web Crypto API
      const sha1 = await crypto.subtle.digest('SHA-1', data);
      const sha256 = await crypto.subtle.digest('SHA-256', data);
      const sha512 = await crypto.subtle.digest('SHA-512', data);

      // MD5 implementation (since Web Crypto doesn't support it)
      const md5Hash = md5(text);

      setHashes({
        md5: md5Hash,
        sha1: bufferToHex(sha1),
        sha256: bufferToHex(sha256),
        sha512: bufferToHex(sha512)
      });
    } catch (e) {
      console.error('Error generating hashes:', e);
    }
  };

  const bufferToHex = (buffer) => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // MD5 implementation
  const md5 = (string) => {
    const rotateLeft = (value, shift) => {
      return (value << shift) | (value >>> (32 - shift));
    };

    const addUnsigned = (x, y) => {
      const lsw = (x & 0xFFFF) + (y & 0xFFFF);
      const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    };

    const F = (x, y, z) => (x & y) | (~x & z);
    const G = (x, y, z) => (x & z) | (y & ~z);
    const H = (x, y, z) => x ^ y ^ z;
    const I = (x, y, z) => y ^ (x | ~z);

    const FF = (a, b, c, d, x, s, ac) => {
      a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const GG = (a, b, c, d, x, s, ac) => {
      a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const HH = (a, b, c, d, x, s, ac) => {
      a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const II = (a, b, c, d, x, s, ac) => {
      a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const convertToWordArray = (str) => {
      const wordArray = [];
      for (let i = 0; i < str.length * 8; i += 8) {
        wordArray[i >> 5] |= (str.charCodeAt(i / 8) & 0xFF) << (i % 32);
      }
      return wordArray;
    };

    const wordArrayToHex = (wordArray) => {
      let hex = '';
      for (let i = 0; i < wordArray.length * 4; i++) {
        hex += ((wordArray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF).toString(16);
        hex += ((wordArray[i >> 2] >> ((i % 4) * 8)) & 0xF).toString(16);
      }
      return hex;
    };

    let x = convertToWordArray(string);
    const len = string.length * 8;

    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    let a = 0x67452301;
    let b = 0xEFCDAB89;
    let c = 0x98BADCFE;
    let d = 0x10325476;

    for (let i = 0; i < x.length; i += 16) {
      const oldA = a, oldB = b, oldC = c, oldD = d;

      a = FF(a, b, c, d, x[i + 0], 7, 0xD76AA478);
      d = FF(d, a, b, c, x[i + 1], 12, 0xE8C7B756);
      c = FF(c, d, a, b, x[i + 2], 17, 0x242070DB);
      b = FF(b, c, d, a, x[i + 3], 22, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[i + 4], 7, 0xF57C0FAF);
      d = FF(d, a, b, c, x[i + 5], 12, 0x4787C62A);
      c = FF(c, d, a, b, x[i + 6], 17, 0xA8304613);
      b = FF(b, c, d, a, x[i + 7], 22, 0xFD469501);
      a = FF(a, b, c, d, x[i + 8], 7, 0x698098D8);
      d = FF(d, a, b, c, x[i + 9], 12, 0x8B44F7AF);
      c = FF(c, d, a, b, x[i + 10], 17, 0xFFFF5BB1);
      b = FF(b, c, d, a, x[i + 11], 22, 0x895CD7BE);
      a = FF(a, b, c, d, x[i + 12], 7, 0x6B901122);
      d = FF(d, a, b, c, x[i + 13], 12, 0xFD987193);
      c = FF(c, d, a, b, x[i + 14], 17, 0xA679438E);
      b = FF(b, c, d, a, x[i + 15], 22, 0x49B40821);

      a = GG(a, b, c, d, x[i + 1], 5, 0xF61E2562);
      d = GG(d, a, b, c, x[i + 6], 9, 0xC040B340);
      c = GG(c, d, a, b, x[i + 11], 14, 0x265E5A51);
      b = GG(b, c, d, a, x[i + 0], 20, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[i + 5], 5, 0xD62F105D);
      d = GG(d, a, b, c, x[i + 10], 9, 0x02441453);
      c = GG(c, d, a, b, x[i + 15], 14, 0xD8A1E681);
      b = GG(b, c, d, a, x[i + 4], 20, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[i + 9], 5, 0x21E1CDE6);
      d = GG(d, a, b, c, x[i + 14], 9, 0xC33707D6);
      c = GG(c, d, a, b, x[i + 3], 14, 0xF4D50D87);
      b = GG(b, c, d, a, x[i + 8], 20, 0x455A14ED);
      a = GG(a, b, c, d, x[i + 13], 5, 0xA9E3E905);
      d = GG(d, a, b, c, x[i + 2], 9, 0xFCEFA3F8);
      c = GG(c, d, a, b, x[i + 7], 14, 0x676F02D9);
      b = GG(b, c, d, a, x[i + 12], 20, 0x8D2A4C8A);

      a = HH(a, b, c, d, x[i + 5], 4, 0xFFFA3942);
      d = HH(d, a, b, c, x[i + 8], 11, 0x8771F681);
      c = HH(c, d, a, b, x[i + 11], 16, 0x6D9D6122);
      b = HH(b, c, d, a, x[i + 14], 23, 0xFDE5380C);
      a = HH(a, b, c, d, x[i + 1], 4, 0xA4BEEA44);
      d = HH(d, a, b, c, x[i + 4], 11, 0x4BDECFA9);
      c = HH(c, d, a, b, x[i + 7], 16, 0xF6BB4B60);
      b = HH(b, c, d, a, x[i + 10], 23, 0xBEBFBC70);
      a = HH(a, b, c, d, x[i + 13], 4, 0x289B7EC6);
      d = HH(d, a, b, c, x[i + 0], 11, 0xEAA127FA);
      c = HH(c, d, a, b, x[i + 3], 16, 0xD4EF3085);
      b = HH(b, c, d, a, x[i + 6], 23, 0x04881D05);
      a = HH(a, b, c, d, x[i + 9], 4, 0xD9D4D039);
      d = HH(d, a, b, c, x[i + 12], 11, 0xE6DB99E5);
      c = HH(c, d, a, b, x[i + 15], 16, 0x1FA27CF8);
      b = HH(b, c, d, a, x[i + 2], 23, 0xC4AC5665);

      a = II(a, b, c, d, x[i + 0], 6, 0xF4292244);
      d = II(d, a, b, c, x[i + 7], 10, 0x432AFF97);
      c = II(c, d, a, b, x[i + 14], 15, 0xAB9423A7);
      b = II(b, c, d, a, x[i + 5], 21, 0xFC93A039);
      a = II(a, b, c, d, x[i + 12], 6, 0x655B59C3);
      d = II(d, a, b, c, x[i + 3], 10, 0x8F0CCC92);
      c = II(c, d, a, b, x[i + 10], 15, 0xFFEFF47D);
      b = II(b, c, d, a, x[i + 1], 21, 0x85845DD1);
      a = II(a, b, c, d, x[i + 8], 6, 0x6FA87E4F);
      d = II(d, a, b, c, x[i + 15], 10, 0xFE2CE6E0);
      c = II(c, d, a, b, x[i + 6], 15, 0xA3014314);
      b = II(b, c, d, a, x[i + 13], 21, 0x4E0811A1);
      a = II(a, b, c, d, x[i + 4], 6, 0xF7537E82);
      d = II(d, a, b, c, x[i + 11], 10, 0xBD3AF235);
      c = II(c, d, a, b, x[i + 2], 15, 0x2AD7D2BB);
      b = II(b, c, d, a, x[i + 9], 21, 0xEB86D391);

      a = addUnsigned(a, oldA);
      b = addUnsigned(b, oldB);
      c = addUnsigned(c, oldC);
      d = addUnsigned(d, oldD);
    }

    return wordArrayToHex([a, b, c, d]);
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Hash Generator</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md font-mono text-sm resize-none"
          placeholder="Enter text to hash..."
        />
      </div>

      <div className="space-y-4">
        {/* MD5 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">MD5</h3>
            {hashes.md5 && (
              <button
                onClick={() => copyHash(hashes.md5)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Copy
              </button>
            )}
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-sm break-all">
            {hashes.md5 || 'Enter text to generate hash'}
          </div>
        </div>

        {/* SHA-1 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">SHA-1</h3>
            {hashes.sha1 && (
              <button
                onClick={() => copyHash(hashes.sha1)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Copy
              </button>
            )}
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-sm break-all">
            {hashes.sha1 || 'Enter text to generate hash'}
          </div>
        </div>

        {/* SHA-256 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">SHA-256</h3>
            {hashes.sha256 && (
              <button
                onClick={() => copyHash(hashes.sha256)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Copy
              </button>
            )}
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-sm break-all">
            {hashes.sha256 || 'Enter text to generate hash'}
          </div>
        </div>

        {/* SHA-512 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">SHA-512</h3>
            {hashes.sha512 && (
              <button
                onClick={() => copyHash(hashes.sha512)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Copy
              </button>
            )}
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-sm break-all">
            {hashes.sha512 || 'Enter text to generate hash'}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">ℹ️ Hash Information</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>MD5:</strong> 128-bit hash (not cryptographically secure)</li>
          <li>• <strong>SHA-1:</strong> 160-bit hash (deprecated for security)</li>
          <li>• <strong>SHA-256:</strong> 256-bit hash (recommended)</li>
          <li>• <strong>SHA-512:</strong> 512-bit hash (most secure)</li>
          <li>• Hashes update automatically as you type</li>
        </ul>
      </div>
    </div>
  );
};

export default HashGenerator;