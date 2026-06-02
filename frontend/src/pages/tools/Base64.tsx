import { useEffect, useState } from "react"

function encodeBase64(message: string) {
  try {
    return btoa(unescape(encodeURIComponent(message)));
  } catch (err) {
    throw new Error('Failed to encode');
  }
}

function decodeBase64(message: string) {
  try {
    return decodeURIComponent(escape(atob(message)));
  } catch (err) {
    throw new Error('Failed to decode');
  }
}

export default function Base64() {
  const modes = ['Encode', 'Decode'];
  const [currentMode, setCurrentMode] = useState('Encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!input) {
      setOutput('');
      setErr('');
      return;
    }

    try {
      if (currentMode === 'Encode') {
        setOutput(encodeBase64(input));
      } else {
        setOutput(decodeBase64(input));
      }
      setErr('');
    } catch (error) {
      setErr('FAILED_TO_PROCESS');
      setOutput('');
    }
  }, [currentMode, input]);

  return (
    <div className="w-full flex flex-col p-2">
      <div className="flex flex-row gap-4 items-center justify-between">
        <span className="td text-lg font-bold">
          Base64 Encode/Decode
        </span>

        <div className="rounded-full border-[1px] border-white/25 p-0 overflow-hidden flex flex-row gap-0
        bg-black/80 backdrop-blur-lg *:cursor-pointer *:px-3">
          {modes.map((mode) => {
            let selected = currentMode === mode;

            return (
              <div
                key={mode}
                onClick={() => setCurrentMode(mode)}
                className={'p-2 transition ' + (selected ? 'bg-[var(--accent)] text-white' : '')}
              >
                {mode}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-2 w-full">
          <span className="font-bold td">
            Output:
          </span>
          <ul className="flex flex-row gap-4 *:underline *:cursor-pointer text-sm">
            <li
              onClick={() => {
                navigator.clipboard.writeText(output);
              }}
            >
              Copy
            </li>
          </ul>

          <code className="bg-black/50 p-2 border-[1px] border-white/25 rounded-lg 
          text-green-500 font-bold overflow-x-auto whitespace-pre-wrap break-all">
            {input ? (
              output
            ) : (
              <span className="font-normal tl">
                Enter a text to {currentMode.toLowerCase()}
              </span>
            )}
          </code>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-bold td">
            {err ? (
              <span className="text-red-800">Failed to process the content</span>
            ) : (
              <>Input:</>
            )}
          </span>
          <ul className="flex flex-row gap-4 *:underline *:cursor-pointer text-sm">
            <li
              onClick={() => {
                navigator.clipboard.writeText(input);
              }}
            >
              Copy
            </li>

            <li
              onClick={() => {
                setInput('');
              }}
            >
              Delete
            </li>
          </ul>
          <textarea
            className="bg-black/80 rounded-lg border-2 border-white/20 w-full min-h-[300px]
            td p-2 focus:outline-none text-sm"
            placeholder="Input text here ..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
