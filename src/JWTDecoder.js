import React, { useState } from 'react';

const JWTDecoder = () => {
  const [jwt, setJwt] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState('');

  const decodeJWT = () => {
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) {
        setError('Invalid JWT format');
        setDecoded(null);
        return;
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      setDecoded({ header, payload });
      setError('');
    } catch (e) {
      setError('Error decoding JWT: ' + e.message);
      setDecoded(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">JWT Decoder</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          JWT Token
        </label>
        <textarea
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md font-mono text-sm resize-none"
          placeholder="Paste your JWT token here..."
        />
        <button
          onClick={decodeJWT}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Decode JWT
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {decoded && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-purple-600">Header</h3>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(decoded.header, null, 2))}
                className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm max-h-96">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-blue-600">Payload</h3>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(decoded.payload, null, 2))}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm max-h-96 break-words whitespace-pre-wrap">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default JWTDecoder;