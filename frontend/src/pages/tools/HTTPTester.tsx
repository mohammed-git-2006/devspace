import { useEffect, useState } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Header {
  key: string;
  value: string;
}

interface RequestResponse {
  status: number;
  statusText: string;
  data: string;
  headers: Record<string, string>;
  time: number;
}

export default function HTTPTester() {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
  
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json' }
  ]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<RequestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');

  const addHeader = () => {
    if (newHeaderKey.trim()) {
      setHeaders([...headers, { key: newHeaderKey, value: newHeaderValue }]);
      setNewHeaderKey('');
      setNewHeaderValue('');
    }
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, key: string, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = { key, value };
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const startTime = performance.now();

      const requestOptions: RequestInit = {
        method,
        headers: headers.reduce((acc, h) => {
          if (h.key.trim()) acc[h.key] = h.value;
          return acc;
        }, {} as Record<string, string>),
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        requestOptions.body = body;
      }

      const res = await fetch(url, requestOptions);
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      let data = '';
      try {
        const text = await res.text();
        // Try to parse as JSON for pretty printing
        try {
          data = JSON.stringify(JSON.parse(text), null, 2);
        } catch {
          data = text;
        }
      } catch {
        data = '';
      }

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
        headers: responseHeaders,
        time: responseTime,
      });
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-500';
    if (status >= 300 && status < 400) return 'text-yellow-500';
    if (status >= 400 && status < 500) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="w-full h-full grid grid-cols-2 gap-5">
      
      {/* Response/Output Section */}
      <div className="flex flex-col gap-2 max-h-[800px] overflow-y-scroll scrollbar-hide">
        <span className="font-bold td">
          <span>Response: </span>
          {response && (
            <>
              <span className={`${getStatusColor(response.status)} font-bold`}>
                {response.status} {response.statusText}
              </span>
              <span className="text-gray-400 ml-2 text-sm">({response.time}ms)</span>
            </>
          )}
          {loading && <span className="text-blue-500 font-bold">Loading...</span>}
          {error && <span className="text-red-500 font-bold">{error}</span>}
        </span>

        {response && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-4 *:underline *:cursor-pointer text-sm">
              <li
                onClick={() => {
                  navigator.clipboard.writeText(response.data);
                }}
              >
                Copy Response
              </li>
            </div>

            {/* Response Body */}
            <div className="flex flex-col gap-2">
              <span className="text-sm tl font-semibold">Body:</span>
              <SyntaxHighlighter
                language={response.data.startsWith('{') || response.data.startsWith('[') ? 'json' : 'text'}
                style={atomDark}
                customStyle={{ borderRadius: '0.5rem', padding: '0.5rem', maxHeight: '300px', overflow: 'auto' }}
              >
                {response.data || 'No response body'}
              </SyntaxHighlighter>
            </div>

            {/* Response Headers */}
            <div className="flex flex-col gap-2">
              <span className="text-sm tl font-semibold">Headers:</span>
              <div className="bg-black/50 p-2 border-[1px] border-white/25 rounded-lg max-h-[200px] overflow-y-auto text-xs">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="py-1 border-b border-white/10 last:border-0">
                    <span className="text-blue-400">{key}: </span>
                    <span className="text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!response && !loading && !error && (
          <div className="text-center py-10">
            <span className="font-normal tl text-gray-400">Send a request to see the response</span>
          </div>
        )}
      </div>

      {/* Input/Configuration Section */}
      <div className="flex flex-col gap-3 max-h-[800px] overflow-y-scroll scrollbar-hide">
        <span className="font-bold td">Configuration:</span>

        {/* Method & URL */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="px-3 py-2 bg-black/80 rounded-lg border border-white/25 focus:outline-none td text-sm font-semibold
              bg-gradient-to-r from-white/15 to-white/10 min-w-[100px]"
            >
              {methods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="https://api.example.com/endpoint"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 p-2 bg-black/80 rounded-lg border border-white/25 focus:outline-none td text-sm"
            />
          </div>

          <button
            onClick={sendRequest}
            disabled={loading}
            className="w-full py-2 bg-[var(--accent)] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Request'}
          </button>
        </div>

        {/* Headers Section */}
        <div className="flex flex-col gap-2">
          <span className="text-sm tl font-semibold">Headers:</span>

          <div className="flex flex-col gap-2 bg-black/50 p-2 rounded-lg border border-white/25 max-h-[200px] overflow-y-auto">
            {headers.map((header, index) => (
              <div key={index} className="flex flex-row gap-2 items-center">
                <input
                  type="text"
                  placeholder="Key"
                  value={header.key}
                  onChange={(e) => updateHeader(index, e.target.value, header.value)}
                  className="flex-1 p-1 bg-black/80 rounded text-xs border border-white/20 focus:outline-none td"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) => updateHeader(index, header.key, e.target.value)}
                  className="flex-1 p-1 bg-black/80 rounded text-xs border border-white/20 focus:outline-none td"
                />
                <button
                  onClick={() => removeHeader(index)}
                  className="px-2 py-1 bg-red-500/30 hover:bg-red-500/50 rounded text-xs text-red-400 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-row gap-2">
            <input
              type="text"
              placeholder="Header Key"
              value={newHeaderKey}
              onChange={(e) => setNewHeaderKey(e.target.value)}
              className="flex-1 p-2 bg-black/80 rounded-lg border border-white/25 focus:outline-none td text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addHeader()}
            />
            <input
              type="text"
              placeholder="Header Value"
              value={newHeaderValue}
              onChange={(e) => setNewHeaderValue(e.target.value)}
              className="flex-1 p-2 bg-black/80 rounded-lg border border-white/25 focus:outline-none td text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addHeader()}
            />
            <button
              onClick={addHeader}
              className="px-3 py-2 bg-[var(--accent)]/30 hover:bg-[var(--accent)]/50 rounded-lg text-[var(--accent)] transition text-sm font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        {/* Body Section */}
        {['POST', 'PUT', 'PATCH'].includes(method) && (
          <div className="flex flex-col gap-2">
            <span className="text-sm tl font-semibold">Request Body:</span>
            <textarea
              placeholder='{"key": "value"}'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2 bg-black/80 rounded-lg border border-white/25 focus:outline-none td text-sm min-h-[150px]"
            />
            <button
              onClick={() => {
                try {
                  const parsed = JSON.parse(body);
                  setBody(JSON.stringify(parsed, null, 2));
                } catch {
                  setError('Invalid JSON');
                }
              }}
              className="px-3 py-2 bg-[var(--accent)]/30 hover:bg-[var(--accent)]/50 rounded-lg text-[var(--accent)] transition text-sm font-semibold"
            >
              Format JSON
            </button>
          </div>
        )}

        {/* Quick Templates */}
        <div className="flex flex-col gap-2">
          <span className="text-sm tl font-semibold">Quick Actions:</span>
          <div className="flex flex-row gap-2 flex-wrap">
            <button
              onClick={() => {
                setHeaders([{ key: 'Content-Type', value: 'application/json' }]);
              }}
              className="px-2 py-1 bg-gray-700/50 hover:bg-gray-700 rounded text-xs td transition"
            >
              Reset Headers
            </button>
            <button
              onClick={() => setBody('')}
              className="px-2 py-1 bg-gray-700/50 hover:bg-gray-700 rounded text-xs td transition"
            >
              Clear Body
            </button>
            <button
              onClick={() => {
                setUrl('');
                setBody('');
                setHeaders([{ key: 'Content-Type', value: 'application/json' }]);
                setResponse(null);
                setError('');
              }}
              className="px-2 py-1 bg-gray-700/50 hover:bg-gray-700 rounded text-xs td transition"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
