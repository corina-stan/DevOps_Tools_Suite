import React, { useState, useEffect } from 'react';

const RegexTester = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (pattern && testString) {
      testRegex();
    } else {
      setMatches([]);
      setError('');
      setStats(null);
    }
  }, [pattern, flags, testString]);

  const testRegex = () => {
    try {
      const flagString = Object.entries(flags)
        .filter(([_, v]) => v)
        .map(([k]) => k)
        .join('');
      
      const regex = new RegExp(pattern, flagString);
      const found = [];
      let match;

      if (flags.g) {
        while ((match = regex.exec(testString)) !== null) {
          found.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          found.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      setMatches(found);
      setError('');
      setStats({
        totalMatches: found.length,
        hasMatch: found.length > 0
      });
    } catch (e) {
      setError(e.message);
      setMatches([]);
      setStats(null);
    }
  };

  const highlightMatches = () => {
    if (!matches.length || !testString) return testString;

    const parts = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({
          text: testString.substring(lastIndex, match.index),
          isMatch: false
        });
      }

      // Add match
      parts.push({
        text: match.text,
        isMatch: true,
        matchNumber: idx + 1
      });

      lastIndex = match.index + match.text.length;
    });

    // Add remaining text
    if (lastIndex < testString.length) {
      parts.push({
        text: testString.substring(lastIndex),
        isMatch: false
      });
    }

    return parts;
  };

  const loadExample = (type) => {
    const examples = {
      email: {
        pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
        test: 'Contact us at support@example.com or sales@company.org for more info.',
        flags: { g: true, i: false, m: false }
      },
      phone: {
        pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}',
        test: 'Call (555) 123-4567 or 555-987-6543 or 555.111.2222',
        flags: { g: true, i: false, m: false }
      },
      url: {
        pattern: 'https?://[^\\s]+',
        test: 'Visit https://example.com or http://test.org for details',
        flags: { g: true, i: false, m: false }
      },
      ipv4: {
        pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
        test: 'Servers: 192.168.1.1, 10.0.0.1, and 172.16.0.1',
        flags: { g: true, i: false, m: false }
      },
      date: {
        pattern: '\\d{4}-\\d{2}-\\d{2}',
        test: 'Dates: 2024-01-15, 2024-12-31, and 2025-06-30',
        flags: { g: true, i: false, m: false }
      }
    };

    const example = examples[type];
    if (example) {
      setPattern(example.pattern);
      setTestString(example.test);
      setFlags(example.flags);
    }
  };

  const toggleFlag = (flag) => {
    setFlags({ ...flags, [flag]: !flags[flag] });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Regular Expression Tester</h2>

      {/* Quick Examples */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Quick Examples:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadExample('email')}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Email
          </button>
          <button
            onClick={() => loadExample('phone')}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Phone
          </button>
          <button
            onClick={() => loadExample('url')}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            URL
          </button>
          <button
            onClick={() => loadExample('ipv4')}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            IPv4
          </button>
          <button
            onClick={() => loadExample('date')}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Date
          </button>
        </div>
      </div>

      {/* Pattern Input */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Regular Expression Pattern
        </label>
        <div className="flex gap-2 items-start">
          <span className="text-2xl text-gray-500 mt-1">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md font-mono"
            placeholder="Enter regex pattern..."
          />
          <span className="text-2xl text-gray-500 mt-1">/</span>
          
          {/* Flags */}
          <div className="flex gap-2 border border-gray-300 rounded-md p-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.g}
                onChange={() => toggleFlag('g')}
                className="w-4 h-4"
              />
              <span className="text-sm font-mono">g</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.i}
                onChange={() => toggleFlag('i')}
                className="w-4 h-4"
              />
              <span className="text-sm font-mono">i</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.m}
                onChange={() => toggleFlag('m')}
                className="w-4 h-4"
              />
              <span className="text-sm font-mono">m</span>
            </label>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          <strong>Flags:</strong> g = global, i = case insensitive, m = multiline
        </div>

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Test String */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test String
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md font-mono text-sm resize-none"
          placeholder="Enter text to test against the regex..."
        />
      </div>

      {/* Statistics */}
      {stats && (
        <div className={`mb-6 p-4 rounded-lg ${
          stats.hasMatch ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{stats.hasMatch ? '✅' : '❌'}</span>
              <span className="font-semibold">
                {stats.hasMatch 
                  ? `${stats.totalMatches} match${stats.totalMatches !== 1 ? 'es' : ''} found`
                  : 'No matches found'
                }
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Highlighted Results */}
      {matches.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Highlighted Matches</h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 font-mono text-sm whitespace-pre-wrap break-words">
            {highlightMatches().map((part, idx) => (
              part.isMatch ? (
                <span
                  key={idx}
                  className="bg-yellow-200 border border-yellow-400 px-1 relative"
                  title={`Match ${part.matchNumber}`}
                >
                  {part.text}
                </span>
              ) : (
                <span key={idx}>{part.text}</span>
              )
            ))}
          </div>
        </div>
      )}

      {/* Match Details */}
      {matches.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Match Details</h3>
          <div className="space-y-3">
            {matches.map((match, idx) => (
              <div key={idx} className="border-b pb-3 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    Match {idx + 1}
                  </span>
                  <span className="text-gray-600 text-sm">
                    at position {match.index}
                  </span>
                </div>
                <div className="bg-gray-50 p-2 rounded font-mono text-sm">
                  {match.text}
                </div>
                {match.groups.length > 0 && (
                  <div className="mt-2 text-sm">
                    <strong>Capture Groups:</strong>
                    <div className="ml-4">
                      {match.groups.map((group, gIdx) => (
                        <div key={gIdx} className="text-gray-600">
                          Group {gIdx + 1}: <span className="font-mono">{group}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regex Reference */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">📖 Quick Reference</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>Character Classes:</strong>
            <ul className="mt-1 space-y-1 font-mono text-xs">
              <li>. = any character</li>
              <li>\d = digit (0-9)</li>
              <li>\w = word character</li>
              <li>\s = whitespace</li>
              <li>[abc] = a, b, or c</li>
              <li>[^abc] = not a, b, or c</li>
            </ul>
          </div>
          <div>
            <strong>Quantifiers:</strong>
            <ul className="mt-1 space-y-1 font-mono text-xs">
              <li>* = 0 or more</li>
              <li>+ = 1 or more</li>
              <li>? = 0 or 1</li>
              <li>{'{n}'} = exactly n</li>
              <li>{'{n,}'} = n or more</li>
              <li>{'{n,m}'} = between n and m</li>
            </ul>
          </div>
          <div>
            <strong>Anchors:</strong>
            <ul className="mt-1 space-y-1 font-mono text-xs">
              <li>^ = start of string</li>
              <li>$ = end of string</li>
              <li>\b = word boundary</li>
            </ul>
          </div>
          <div>
            <strong>Groups:</strong>
            <ul className="mt-1 space-y-1 font-mono text-xs">
              <li>(abc) = capture group</li>
              <li>(?:abc) = non-capturing</li>
              <li>a|b = a or b</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTester;