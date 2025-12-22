import React, { useState } from 'react';

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true
  });

  const generatePassword = () => {
    let charset = '';
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      setPassword('Please select at least one option');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Password Generator</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Length: {length}
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(Math.min(64, Math.max(4, parseInt(e.target.value) || 4)))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.lowercase}
              onChange={(e) => setOptions({...options, lowercase: e.target.checked})}
              className="w-4 h-4"
            />
            <span>Lowercase (a-z)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.uppercase}
              onChange={(e) => setOptions({...options, uppercase: e.target.checked})}
              className="w-4 h-4"
            />
            <span>Uppercase (A-Z)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.numbers}
              onChange={(e) => setOptions({...options, numbers: e.target.checked})}
              className="w-4 h-4"
            />
            <span>Numbers (0-9)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.symbols}
              onChange={(e) => setOptions({...options, symbols: e.target.checked})}
              className="w-4 h-4"
            />
            <span>Symbols (!@#$%...)</span>
          </label>
        </div>

        <button
          onClick={generatePassword}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Generate Password
        </button>
      </div>

      {password && (
        <div className="bg-gray-50 rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Generated Password
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={password}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md bg-white font-mono"
            />
            <button
              onClick={() => navigator.clipboard.writeText(password)}
              className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;