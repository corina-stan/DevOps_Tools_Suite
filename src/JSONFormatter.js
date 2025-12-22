import React, { useState } from 'react';

const JSONFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [stats, setStats] = useState(null);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');
      setIsValid(true);
      
      // Calculate statistics
      const lines = formatted.split('\n').length;
      const size = new Blob([formatted]).size;
      const depth = getJSONDepth(parsed);
      
      setStats({
        lines,
        size,
        depth,
        type: Array.isArray(parsed) ? 'Array' : typeof parsed === 'object' ? 'Object' : typeof parsed
      });
    } catch (e) {
      setError(e.message);
      setOutput('');
      setIsValid(false);
      setStats(null);
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
      setIsValid(true);
      
      const size = new Blob([minified]).size;
      setStats({
        lines: 1,
        size,
        depth: getJSONDepth(parsed),
        type: Array.isArray(parsed) ? 'Array' : typeof parsed === 'object' ? 'Object' : typeof parsed
      });
    } catch (e) {
      setError(e.message);
      setOutput('');
      setIsValid(false);
      setStats(null);
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(input);
      setError('');
      setIsValid(true);
      setOutput('✅ Valid JSON');
    } catch (e) {
      setError(e.message);
      setIsValid(false);
      setOutput('');
    }
  };

  const getJSONDepth = (obj, depth = 0) => {
    if (obj === null || typeof obj !== 'object') return depth;
    
    const depths = Object.values(obj).map(value => getJSONDepth(value, depth + 1));
    return Math.max(depth, ...depths);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setIsValid(null);
    setStats(null);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const loadSample = () => {
    const sample = {
      "name": "DevOps Tools",
      "version": "1.0.0",
      "modules": [
        "Password Generator",
        "Base64 Encoder",
        "JWT Decoder",
        "Certificate Decoder",
        "JSON Formatter"
      ],
      "config": {
        "theme": "blue",
        "responsive": true
      }
    };
    setInput(JSON.stringify(sample));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">JSON Formatter & Validator</h2>
      
      {/* Validation Status */}
      {isValid !== null && (
        <div className={`mb-4 p-4 rounded-lg ${
          isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {isValid ? '✅' : '❌'}
            </span>
            <span className={`font-semibold ${isValid ? 'text-green-700' : 'text-red-700'}`}>
              {isValid ? 'Valid JSON' : 'Invalid JSON'}
            </span>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">JSON Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Type:</span>
              <span className="ml-2 text-blue-900">{stats.type}</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Lines:</span>
              <span className="ml-2 text-blue-900">{stats.lines}</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Size:</span>
              <span className="ml-2 text-blue-900">{stats.size} bytes</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Depth:</span>
              <span className="ml-2 text-blue-900">{stats.depth}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Input JSON
            </label>
            <button
              onClick={loadSample}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Load Sample
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 px-4 py-3 border border-gray-300 rounded-md font-mono text-sm resize-none"
            placeholder='{"key": "value", "array": [1, 2, 3]}'
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Output
            </label>
            {output && (
              <button
                onClick={copyOutput}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Copy
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-96 px-4 py-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm resize-none"
            placeholder="Formatted JSON will appear here..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          onClick={formatJSON}
          className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Format
        </button>
        <button
          onClick={minifyJSON}
          className="bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
        >
          Minify
        </button>
        <button
          onClick={validateJSON}
          className="bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Validate
        </button>
        <button
          onClick={copyOutput}
          disabled={!output}
          className="bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Copy Output
        </button>
        <button
          onClick={clearAll}
          className="bg-gray-600 text-white py-3 rounded-md hover:bg-gray-700 transition-colors font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">💡 Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Format:</strong> Pretty-print JSON with 2-space indentation</li>
          <li>• <strong>Minify:</strong> Remove all whitespace for compact JSON</li>
          <li>• <strong>Validate:</strong> Check if JSON is syntactically correct</li>
          <li>• Supports nested objects and arrays of any depth</li>
        </ul>
      </div>
    </div>
  );
};

export default JSONFormatter;