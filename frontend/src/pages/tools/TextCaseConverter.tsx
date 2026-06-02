import { useEffect, useState } from "react"

function convertCase(text: string, caseType: string): string {
  switch (caseType) {
    case 'Uppercase':
      return text.toUpperCase();
    case 'Lowercase':
      return text.toLowerCase();
    case 'Title Case':
      return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    case 'Sentence Case':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'camelCase':
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
    case 'PascalCase':
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
        .charAt(0)
        .toUpperCase() + text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
        .slice(1);
    case 'snake_case':
      return text.toLowerCase().replace(/\s+/g, '_').replace(/[^\w_]/g, '');
    case 'kebab-case':
      return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    default:
      return text;
  }
}

export default function TextCaseConverter() {
  const modes = ['Uppercase', 'Lowercase', 'Title Case', 'Sentence Case', 'camelCase', 'PascalCase', 'snake_case', 'kebab-case'];
  const [currentMode, setCurrentMode] = useState('Uppercase');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }

    try {
      setOutput(convertCase(input, currentMode));
    } catch (error) {
      setOutput('');
    }
  }, [currentMode, input]);

  return (
    <div className="w-full flex flex-col p-2">
      <div className="flex flex-row gap-4 items-center justify-between">
        <span className="td text-lg font-bold">
          Text Case Converter
        </span>

        <div className="rounded-full border-[1px] border-white/25 p-0 overflow-hidden flex flex-row gap-0
        bg-black/80 backdrop-blur-lg *:cursor-pointer *:px-3 flex-wrap justify-end">
          {modes.map((mode) => {
            let selected = currentMode === mode;

            return (
              <div
                key={mode}
                onClick={() => setCurrentMode(mode)}
                className={'p-2 transition text-sm ' + (selected ? 'bg-[var(--accent)] text-white' : '')}
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
                Enter text to convert
              </span>
            )}
          </code>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-bold td">
            <>Input:</>
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
            className="bg-black/80 rounded-lg border-2 border-white/20 w-full min-h-[500px]
            td p-2 focus:outline-none"
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
