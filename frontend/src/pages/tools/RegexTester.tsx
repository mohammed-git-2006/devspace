import { useEffect, useState } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function RegexTester()
{
  const [pattern, setPattern] = useState<string>('\\b[a-z]+\\b')
  const [testString, setTestString] = useState<string>('The quick brown fox jumps over the lazy dog')
  const [flags, setFlags] = useState<string>('gi')
  const [err, setErr] = useState('')
  const [output, setOutput] = useState('')
  const [matchCount, setMatchCount] = useState(0)

  const flagOptions = [
    { flag: 'g', label: 'Global', description: 'Find all matches' },
    { flag: 'i', label: 'Ignore Case', description: 'Case-insensitive' },
    { flag: 'm', label: 'Multiline', description: 'Treat ^ and $ as line boundaries' },
    { flag: 's', label: 'Dotall', description: '. matches newlines' }
  ];

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  useEffect(() => {
    if (!pattern || !testString) {
      setOutput('');
      setErr('');
      setMatchCount(0);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches = testString.match(regex);
      
      if (matches && matches.length > 0) {
        const result = {
          matchCount: matches.length,
          matches: matches,
          firstMatch: matches[0],
          allMatches: matches
        };
        setOutput(JSON.stringify(result, null, 2));
        setMatchCount(matches.length);
        setErr('');
      } else {
        setOutput(JSON.stringify({ matchCount: 0, matches: null }, null, 2));
        setMatchCount(0);
        setErr('');
      }
    } catch (error) {
      setErr('INVALID_REGEX');
      setOutput('');
      setMatchCount(0);
    }
  }, [pattern, testString, flags]);

  return (
    <div className="w-full h-full grid grid-cols-2 gap-5">
      
      <div className="flex flex-col gap-2 max-h-[600px] overflow-y-scroll scrollbar-hide">
        <span className="font-bold td">
          <span>Results: </span>
          {!err && <span className={(matchCount > 0 ? 'text-green-500' : 'text-red-800') + ' font-bold'}>
            {matchCount > 0 ? `${matchCount} match${matchCount !== 1 ? 'es' : ''} found` : 'No matches'}
          </span>}
        </span>
        
        <SyntaxHighlighter
          language="json"
          style={atomDark}
          customStyle={{ borderRadius: '0.5rem', padding: '1rem' }}
        >
          {output || '{}'}
        </SyntaxHighlighter>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-bold td">
          {err ? <span className="text-red-500">Invalid regex pattern</span> : <>Configuration:</> }
        </span>

        <div className="flex flex-col gap-3">
          {/* Pattern Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm tl">Regex Pattern:</label>
            <input
              type="text"
              placeholder="Enter regex pattern..."
              className="w-full p-2 bg-black/80 rounded-lg border-2 border-white/20 focus:outline-none td"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
            />
          </div>

          {/* Test String */}
          <div className="flex flex-col gap-1">
            <label className="text-sm tl">Test String:</label>
            <textarea
              className="bg-black/80 rounded-lg border-2 border-white/20 w-full min-h-[150px] td p-2 focus:outline-none"
              placeholder="Enter text to test..."
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
            ></textarea>
          </div>

          {/* Flags */}
          <div className="flex flex-col gap-2">
            <label className="text-sm tl">Flags:</label>
            <div className="flex flex-row flex-wrap gap-2">
              {flagOptions.map((opt) => (
                <label key={opt.flag} className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="peer hidden"
                    checked={flags.includes(opt.flag)}
                    onChange={() => toggleFlag(opt.flag)}
                  />
                  <span className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center
                              peer-checked:bg-[var(--accent)] peer-checked:border-[var(--accent)]
                              transition-colors duration-200">
                    <svg className="hidden peer-checked:block w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tl">{opt.label}</span>
                </label>
              ))}
            </div>
            <span className="text-xs tl opacity-70">
              Current flags: /{pattern}/{flags}
            </span>
          </div>

          {/* Action Buttons */}
          <ul className="flex flex-row gap-4 *:underline *:cursor-pointer text-sm mt-2">
            <li onClick={() => {
              navigator.clipboard.writeText(output);
            }}>Copy Results</li>
            <li onClick={() => {
              setPattern('');
              setTestString('');
              setFlags('gi');
            }}>Clear All</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
