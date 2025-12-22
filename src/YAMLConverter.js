import React, { useState } from 'react';

const YAMLConverter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // Simple YAML to JSON converter
  const yamlToJson = () => {
    try {
      const lines = input.trim().split('\n');
      const result = parseYAML(lines);
      setOutput(JSON.stringify(result, null, 2));
      setError('');
    } catch (e) {
      setError('Error converting YAML to JSON: ' + e.message);
      setOutput('');
    }
  };

  // Simple JSON to YAML converter
  const jsonToYaml = () => {
    try {
      const obj = JSON.parse(input);
      const yaml = toYAML(obj, 0);
      setOutput(yaml);
      setError('');
    } catch (e) {
      setError('Error converting JSON to YAML: ' + e.message);
      setOutput('');
    }
  };

  // Parse YAML (simplified parser for common cases)
  const parseYAML = (lines) => {
    const result = {};
    const stack = [{ obj: result, indent: -1 }];
    
    for (let line of lines) {
      if (!line.trim() || line.trim().startsWith('#')) continue;
      
      const indent = line.search(/\S/);
      const content = line.trim();
      
      // Pop stack to correct level
      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
        stack.pop();
      }
      
      const current = stack[stack.length - 1].obj;
      
      if (content.includes(':')) {
        const colonIndex = content.indexOf(':');
        let key = content.substring(0, colonIndex).trim();
        let value = content.substring(colonIndex + 1).trim();
        
        // Remove quotes if present
        key = key.replace(/^["']|["']$/g, '');
        
        if (!value || value === '') {
          // Object or array coming
          const newObj = {};
          if (Array.isArray(current)) {
            current.push(newObj);
          } else {
            current[key] = newObj;
          }
          stack.push({ obj: newObj, indent });
        } else if (value.startsWith('[') && value.endsWith(']')) {
          // Inline array
          const arr = value.slice(1, -1).split(',').map(v => parseValue(v.trim()));
          current[key] = arr;
        } else if (value.startsWith('{') && value.endsWith('}')) {
          // Inline object
          current[key] = JSON.parse(value);
        } else {
          current[key] = parseValue(value);
        }
      } else if (content.startsWith('-')) {
        // Array item
        const value = content.substring(1).trim();
        if (!Array.isArray(current)) {
          // Convert object to array in parent
          const parent = stack[stack.length - 2];
          if (parent) {
            const keys = Object.keys(parent.obj);
            const lastKey = keys[keys.length - 1];
            parent.obj[lastKey] = [];
            stack[stack.length - 1].obj = parent.obj[lastKey];
          }
        }
        if (Array.isArray(stack[stack.length - 1].obj)) {
          stack[stack.length - 1].obj.push(parseValue(value));
        }
      }
    }
    
    return result;
  };

  // Parse value with type detection
  const parseValue = (value) => {
    value = value.replace(/^["']|["']$/g, ''); // Remove quotes
    
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (!isNaN(value) && value !== '') return Number(value);
    
    return value;
  };

  // Convert object to YAML
  const toYAML = (obj, indent = 0) => {
    const spaces = '  '.repeat(indent);
    let yaml = '';
    
    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (typeof item === 'object' && item !== null) {
          yaml += `${spaces}-\n${toYAML(item, indent + 1)}`;
        } else {
          yaml += `${spaces}- ${formatValue(item)}\n`;
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
          yaml += `${spaces}${key}:\n${toYAML(value, indent + 1)}`;
        } else if (typeof value === 'object' && value !== null) {
          yaml += `${spaces}${key}:\n${toYAML(value, indent + 1)}`;
        } else {
          yaml += `${spaces}${key}: ${formatValue(value)}\n`;
        }
      }
    }
    
    return yaml;
  };

  // Format value for YAML output
  const formatValue = (value) => {
    if (typeof value === 'string') {
      // Quote strings with special characters
      if (value.includes(':') || value.includes('#') || value.includes('\n')) {
        return `"${value}"`;
      }
      return value;
    }
    if (value === null) return 'null';
    return String(value);
  };

  const loadSampleYAML = () => {
    const sample = `name: DevOps Tools
version: 1.0.0
modules:
  - Password Generator
  - Base64 Encoder
  - JWT Decoder
  - Certificate Decoder
  - JSON Formatter
config:
  theme: blue
  responsive: true
  features:
    darkMode: false
    analytics: true`;
    setInput(sample);
  };

  const loadSampleJSON = () => {
    const sample = {
      "name": "DevOps Tools",
      "version": "1.0.0",
      "modules": [
        "Password Generator",
        "Base64 Encoder",
        "JWT Decoder"
      ],
      "config": {
        "theme": "blue",
        "responsive": true
      }
    };
    setInput(JSON.stringify(sample, null, 2));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">YAML ↔ JSON Converter</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Input
            </label>
            <div className="flex gap-2">
              <button
                onClick={loadSampleYAML}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Load YAML
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
            className="w-full h-96 px-4 py-3 border border-gray-300 rounded-md font-mono text-sm resize-none"
            placeholder="Paste YAML or JSON here..."
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
            className="w-full h-96 px-4 py-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm resize-none"
            placeholder="Converted output will appear here..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={yamlToJson}
          className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          YAML → JSON
        </button>
        <button
          onClick={jsonToYaml}
          className="bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          JSON → YAML
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">💡 Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Converts between YAML and JSON formats</li>
          <li>• Supports nested objects and arrays</li>
          <li>• Handles strings, numbers, booleans, and null values</li>
          <li>• Use sample buttons to see examples</li>
        </ul>
      </div>
    </div>
  );
};

export default YAMLConverter;