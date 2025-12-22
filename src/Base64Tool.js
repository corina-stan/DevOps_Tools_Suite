import React, { useState } from 'react';

const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => {
    try {
      setOutput(btoa(input));
    } catch (e) {
      setOutput('Error: Invalid input for encoding');
    }
  };

  const decode = () => {
    try {
      setOutput(atob(input));
    } catch (e) {
      setOutput('Error: Invalid Base64 string');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Base64 Encoder/Decoder</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-md font-mono text-sm resize-none"
            placeholder="Enter text to encode or Base64 to decode..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm resize-none"
            placeholder="Result will appear here..."
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={encode}
          className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Encode to Base64
        </button>
        <button
          onClick={decode}
          className="flex-1 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Decode from Base64
        </button>
      </div>
    </div>
  );
};

export default Base64Tool;