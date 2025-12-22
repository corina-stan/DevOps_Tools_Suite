import React, { useState, useEffect } from 'react';

const TimestampConverter = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timestamp, setTimestamp] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timestampToDate = () => {
    try {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        setResult({ error: 'Invalid timestamp' });
        return;
      }

      // Auto-detect seconds vs milliseconds
      const date = ts.toString().length === 10 
        ? new Date(ts * 1000) 
        : new Date(ts);

      setResult({
        utc: date.toUTCString(),
        iso: date.toISOString(),
        local: date.toLocaleString(),
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        relative: getRelativeTime(date)
      });
    } catch (e) {
      setResult({ error: 'Error converting timestamp' });
    }
  };

  const dateToTimestamp = () => {
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) {
        setResult({ error: 'Invalid date/time' });
        return;
      }

      setResult({
        seconds: Math.floor(date.getTime() / 1000),
        milliseconds: date.getTime(),
        iso: date.toISOString(),
        utc: date.toUTCString()
      });
    } catch (e) {
      setResult({ error: 'Error converting date/time' });
    }
  };

  const getNow = () => {
    const now = new Date();
    setResult({
      seconds: Math.floor(now.getTime() / 1000),
      milliseconds: now.getTime(),
      iso: now.toISOString(),
      utc: now.toUTCString(),
      local: now.toLocaleString()
    });
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(Math.abs(diff) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    const isFuture = diff < 0;
    const prefix = isFuture ? 'in ' : '';
    const suffix = isFuture ? '' : ' ago';

    if (years > 0) return `${prefix}${years} year${years > 1 ? 's' : ''}${suffix}`;
    if (months > 0) return `${prefix}${months} month${months > 1 ? 's' : ''}${suffix}`;
    if (days > 0) return `${prefix}${days} day${days > 1 ? 's' : ''}${suffix}`;
    if (hours > 0) return `${prefix}${hours} hour${hours > 1 ? 's' : ''}${suffix}`;
    if (minutes > 0) return `${prefix}${minutes} minute${minutes > 1 ? 's' : ''}${suffix}`;
    return `${prefix}${seconds} second${seconds !== 1 ? 's' : ''}${suffix}`;
  };

  const loadExample = (type) => {
    const now = new Date();
    if (type === 'now-seconds') {
      setTimestamp(Math.floor(now.getTime() / 1000).toString());
    } else if (type === 'now-ms') {
      setTimestamp(now.getTime().toString());
    } else if (type === 'datetime') {
      setDateTime(now.toISOString().slice(0, 16));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Unix Timestamp Converter</h2>

      {/* Current Time Display */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 mb-6">
        <div className="text-center">
          <div className="text-sm opacity-90 mb-2">Current Unix Timestamp</div>
          <div className="text-4xl font-bold font-mono mb-2">
            {Math.floor(currentTime.getTime() / 1000)}
          </div>
          <div className="text-sm opacity-90">
            {currentTime.toUTCString()}
          </div>
        </div>
        <button
          onClick={getNow}
          className="mt-4 w-full bg-white text-blue-600 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium"
        >
          Get Current Timestamp Details
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Timestamp to Date */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Timestamp → Date</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unix Timestamp
            </label>
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md font-mono"
              placeholder="1640000000"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => loadExample('now-seconds')}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Now (seconds)
              </button>
              <button
                onClick={() => loadExample('now-ms')}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Now (milliseconds)
              </button>
            </div>
          </div>
          <button
            onClick={timestampToDate}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Convert to Date
          </button>
        </div>

        {/* Date to Timestamp */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Date → Timestamp</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={() => loadExample('datetime')}
              className="text-xs text-blue-600 hover:text-blue-700 mt-2"
            >
              Load current time
            </button>
          </div>
          <button
            onClick={dateToTimestamp}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            Convert to Timestamp
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Result</h3>
          
          {result.error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {result.error}
            </div>
          ) : (
            <div className="space-y-3">
              {result.seconds && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium text-gray-700">Seconds:</span>
                  <span className="font-mono text-gray-900">{result.seconds}</span>
                </div>
              )}
              {result.milliseconds && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium text-gray-700">Milliseconds:</span>
                  <span className="font-mono text-gray-900">{result.milliseconds}</span>
                </div>
              )}
              {result.iso && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium text-gray-700">ISO 8601:</span>
                  <span className="font-mono text-sm text-gray-900">{result.iso}</span>
                </div>
              )}
              {result.utc && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium text-gray-700">UTC:</span>
                  <span className="text-sm text-gray-900">{result.utc}</span>
                </div>
              )}
              {result.local && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium text-gray-700">Local:</span>
                  <span className="text-sm text-gray-900">{result.local}</span>
                </div>
              )}
              {result.date && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="text-sm text-gray-900">{result.date}</span>
                </div>
              )}
              {result.time && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium text-gray-700">Time:</span>
                  <span className="text-sm text-gray-900">{result.time}</span>
                </div>
              )}
              {result.relative && (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Relative:</span>
                  <span className="text-sm text-gray-900">{result.relative}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">ℹ️ About Unix Timestamps</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Unix timestamp = seconds since January 1, 1970 (UTC)</li>
          <li>• 10-digit timestamps are in seconds</li>
          <li>• 13-digit timestamps are in milliseconds</li>
          <li>• Current timestamp updates in real-time</li>
          <li>• Supports both past and future dates</li>
        </ul>
      </div>
    </div>
  );
};

export default TimestampConverter;