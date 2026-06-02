import { useEffect, useState } from "react"

interface WordStats {
  words: number;
  characters: number;
  charactersWithoutSpaces: number;
  sentences: number;
  paragraphs: number;
  averageWordLength: number;
  lines: number;
}

function countWords(text: string): WordStats {
  const trimmedText = text.trim();
  
  if (!trimmedText) {
    return {
      words: 0,
      characters: 0,
      charactersWithoutSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      averageWordLength: 0,
      lines: 0
    };
  }

  const words = trimmedText.split(/\s+/).filter(word => word.length > 0);
  const characters = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, '').length;
  const sentences = trimmedText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = trimmedText.split(/\n\n+/).filter(p => p.trim().length > 0).length;
  const lines = trimmedText.split('\n').length;
  const averageWordLength = words.length > 0 ? (charactersWithoutSpaces / words.length).toFixed(2) : 0;

  return {
    words: words.length,
    characters,
    charactersWithoutSpaces,
    sentences,
    paragraphs,
    averageWordLength: parseFloat(averageWordLength as string),
    lines
  };
}

export default function WordCounter() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<WordStats>({
    words: 0,
    characters: 0,
    charactersWithoutSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    averageWordLength: 0,
    lines: 0
  });

  useEffect(() => {
    const newStats = countWords(input);
    setStats(newStats);
  }, [input]);

  const output = JSON.stringify(stats, null, 2);

  return (
    <div className="w-full flex flex-col p-2">
      <div className="flex flex-row gap-4 items-center justify-between">
        <span className="td text-lg font-bold">
          Word Counter
        </span>
      </div>

      <div className="w-full grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-2 w-full">
          <span className="font-bold td">
            Statistics:
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
          text-green-500 font-bold overflow-x-auto whitespace-pre-wrap break-all max-h-[500px] overflow-y-auto">
            {output}
          </code>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-bold td">
            <>Input Text:</>
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
            placeholder="Paste or type your text here ..."
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
