import React, { useState } from 'react';

const URLEncoder = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => {
    try {
      setOutput(encodeURIComponent(input));
    } catch (e) {
      setOutput('Error encoding URL');
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      setOutput('Error decoding URL');
    }
  };

  const encodeURL = () => {
    try {
      setOutput(encodeURI(input));
    } catch (e) {
      setOutput('Error encoding URL');
    }
  };

  const parseQueryString = () => {
    try {
      const url = input.includes('?') ? input.split('?')[1] : input;
      const params = new URLSearchParams(url);
      const result = {};
      
      for (const [key, value] of params) {
        result[key] = value;
      }
      
      setOutput(JSON.stringify(result, null, 2));
    } catch (e) {
      setOutput('Error parsing query string');
    }
  };

  const buildQueryString = () => {
    try {
      const obj = JSON.parse(input);
      const params = new URLSearchParams(obj);
      setOutput(params.toString());
    } catch (e) {
      setOutput('Error building query string. Make sure input is valid JSON.');
    }
  };

  const loadSampleURL = () => {
    setInput('https://example.com/search?q=hello world&page=1&filter=active');
  };

  const loadSampleJSON = () => {
    setInput(JSON.stringify({
      q: 'hello world',
      page: 1,
      filter: 'active'
    }, null, 2));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">URL Encoder/Decoder</h2>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Input
            </label>
            <div className="flex gap-2">
              <button
                onClick={loadSampleURL}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Load URL
              </button>
              <button
                onClick={loadSampleJSON}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Load JSON
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-md font-mono text-sm resize-none"
            placeholder="Enter URL, query string, or JSON..."
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
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Copy
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm resize-none"
            placeholder="Result will appear here..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <button
          onClick={encode}
          className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Encode Component
        </button>
        <button
          onClick={decode}
          className="bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Decode Component
        </button>
        <button
          onClick={encodeURL}
          className="bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
        >
          Encode URL
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={parseQueryString}
          className="bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition-colors font-medium"
        >
          Parse Query String
        </button>
        <button
          onClick={buildQueryString}
          className="bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition-colors font-medium"
        >
          Build Query String
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">💡 Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Encode Component:</strong> Encode text for use in URLs (encodes all special chars)</li>
          <li>• <strong>Decode Component:</strong> Decode URL-encoded text</li>
          <li>• <strong>Encode URL:</strong> Encode full URL (preserves :, /, ?, &amp;, =)</li>
          <li>• <strong>Parse Query String:</strong> Convert query string to JSON object</li>
          <li>• <strong>Build Query String:</strong> Convert JSON object to query string</li>
        </ul>
      </div>

      {/* Examples */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📖 Examples</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <div>
            <strong>Before:</strong> <code>hello world & special chars!</code><br/>
            <strong>After encode:</strong> <code>hello%20world%20%26%20special%20chars!</code>
          </div>
          <div>
            <strong>Query String:</strong> <code>?name=John&age=30&city=New York</code><br/>
            <strong>Parsed JSON:</strong> <code>{"{'name':'John','age':'30','city':'New York'}"}</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLEncoder;