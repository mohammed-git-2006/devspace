import { useEffect, useState } from "react"

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNum: number;
}

interface DiffStats {
  added: number;
  removed: number;
  unchanged: number;
  similarity: number;
}

function computeDiff(text1: string, text2: string): { lines1: DiffLine[]; lines2: DiffLine[] } {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  
  const lcs = computeLCS(lines1, lines2);
  const result1: DiffLine[] = [];
  const result2: DiffLine[] = [];
  
  let i = 0, j = 0, lcsIdx = 0;
  let lineNum1 = 1, lineNum2 = 1;

  while (i < lines1.length || j < lines2.length) {
    if (lcsIdx < lcs.length && i < lines1.length && j < lines2.length && 
        lines1[i] === lcs[lcsIdx] && lines2[j] === lcs[lcsIdx]) {
      result1.push({ type: 'unchanged', content: lines1[i], lineNum: lineNum1++ });
      result2.push({ type: 'unchanged', content: lines2[j], lineNum: lineNum2++ });
      i++;
      j++;
      lcsIdx++;
    } else if (i < lines1.length && (j >= lines2.length || !lines2.slice(j).includes(lines1[i]))) {
      result1.push({ type: 'removed', content: lines1[i], lineNum: lineNum1++ });
      i++;
    } else if (j < lines2.length) {
      result2.push({ type: 'added', content: lines2[j], lineNum: lineNum2++ });
      j++;
    }
  }

  return { lines1: result1, lines2: result2 };
}

function computeLCS(arr1: string[], arr2: string[]): string[] {
  const m = arr1.length;
  const n = arr2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const lcs: string[] = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (arr1[i - 1] === arr2[j - 1]) {
      lcs.unshift(arr1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return lcs;
}

function getDiffStats(lines1: DiffLine[], lines2: DiffLine[]): DiffStats {
  const added = lines2.filter(l => l.type === 'added').length;
  const removed = lines1.filter(l => l.type === 'removed').length;
  const unchanged = lines1.filter(l => l.type === 'unchanged').length;
  const total = Math.max(lines1.length, lines2.length);
  const similarity = total > 0 ? Math.round((unchanged / total) * 100) : 100;

  return { added, removed, unchanged, similarity };
}

export default function DiffChecker() {
  const [text1, setText1] = useState('Hello World\nThis is a test\nLine 3');
  const [text2, setText2] = useState('Hello World\nThis is a test file\nLine 3\nLine 4');
  const [diff, setDiff] = useState({ lines1: [] as DiffLine[], lines2: [] as DiffLine[] });
  const [stats, setStats] = useState<DiffStats>({ added: 0, removed: 0, unchanged: 0, similarity: 100 });

  useEffect(() => {
    const newDiff = computeDiff(text1, text2);
    setDiff(newDiff);
    setStats(getDiffStats(newDiff.lines1, newDiff.lines2));
  }, [text1, text2]);

  const DiffLine = ({ line, index }: { line: DiffLine; index: number }) => {
    let bgColor = 'bg-transparent';
    let textColor = 'text-gray-300';
    let prefix = ' ';

    if (line.type === 'added') {
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      prefix = '+';
    } else if (line.type === 'removed') {
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      prefix = '-';
    } else {
      prefix = ' ';
    }

    return (
      <div key={index} className={`${bgColor} border-l-2 ${line.type === 'added' ? 'border-green-500' : line.type === 'removed' ? 'border-red-500' : 'border-transparent'} pl-2 py-1 font-mono text-xs`}>
        <span className="text-gray-500 mr-2">{prefix}</span>
        <span className={textColor}>{line.content || <span className="text-gray-600 italic">(empty line)</span>}</span>
      </div>
    );
  };

  return (
    <div className="w-full h-full grid grid-cols-2 gap-5">
      
      {/* Left Panel - Text 1 */}
      <div className="flex flex-col gap-2 max-h-[800px] overflow-hidden">
        <div className="flex flex-row justify-between items-center">
          <span className="font-bold td text-sm">Original Text:</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(text1);
            }}
            className="px-2 py-1 text-xs bg-[var(--accent)]/30 hover:bg-[var(--accent)]/50 rounded text-[var(--accent)] transition"
          >
            Copy
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-black/50 rounded-lg border border-white/25">
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            className="flex-1 p-3 bg-transparent focus:outline-none td text-xs font-mono resize-none border-b border-white/25"
            placeholder="Enter original text here..."
          />

          <div className="flex-1 overflow-y-auto bg-black/30 p-2">
            {diff.lines1.length > 0 ? (
              diff.lines1.map((line, idx) => <DiffLine key={idx} line={line} index={idx} />)
            ) : (
              <div className="text-gray-500 text-xs p-2">Enter text to see differences</div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Text 2 & Stats */}
      <div className="flex flex-col gap-2 max-h-[800px] overflow-hidden">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center">
            <span className="font-bold td text-sm">Modified Text:</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(text2);
              }}
              className="px-2 py-1 text-xs bg-[var(--accent)]/30 hover:bg-[var(--accent)]/50 rounded text-[var(--accent)] transition"
            >
              Copy
            </button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden bg-black/50 rounded-lg border border-white/25 max-h-[400px]">
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className="flex-1 p-3 bg-transparent focus:outline-none td text-xs font-mono resize-none border-b border-white/25"
              placeholder="Enter modified text here..."
            />

            <div className="flex-1 overflow-y-auto bg-black/30 p-2">
              {diff.lines2.length > 0 ? (
                diff.lines2.map((line, idx) => <DiffLine key={idx} line={line} index={idx} />)
              ) : (
                <div className="text-gray-500 text-xs p-2">Enter text to see differences</div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-black/50 p-3 rounded-lg border border-white/25">
          <span className="font-bold td text-sm block mb-3">Statistics:</span>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs tl">Similarity:</span>
              <div className="flex flex-row items-center gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all ${stats.similarity >= 70 ? 'bg-green-500' : stats.similarity >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${stats.similarity}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${stats.similarity >= 70 ? 'text-green-500' : stats.similarity >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {stats.similarity}%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs tl">Unchanged:</span>
              <span className="text-sm font-bold text-gray-300">{stats.unchanged} lines</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs tl">Removed:</span>
              <span className="text-sm font-bold text-red-400">- {stats.removed} lines</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs tl">Added:</span>
              <span className="text-sm font-bold text-green-400">+ {stats.added} lines</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/25">
            <div className="text-xs tl mb-2">Legend:</div>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex flex-row items-center gap-2">
                <div className="w-3 h-3 bg-green-500/30 border-l-2 border-green-500 rounded-sm"></div>
                <span>Added lines</span>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="w-3 h-3 bg-red-500/30 border-l-2 border-red-500 rounded-sm"></div>
                <span>Removed lines</span>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="w-3 h-3 bg-transparent border-l-2 border-transparent rounded-sm"></div>
                <span>Unchanged lines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-2">
          <span className="text-xs tl font-semibold">Quick Actions:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setText1(text2);
              }}
              className="px-2 py-2 bg-gray-700/50 hover:bg-gray-700 rounded text-xs td transition"
            >
              Copy Left to Right
            </button>
            <button
              onClick={() => {
                setText2(text1);
              }}
              className="px-2 py-2 bg-gray-700/50 hover:bg-gray-700 rounded text-xs td transition"
            >
              Copy Right to Left
            </button>
            <button
              onClick={() => {
                setText1('');
                setText2('');
              }}
              className="px-2 py-2 bg-gray-700/50 hover:bg-gray-700 rounded text-xs td transition col-span-2"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
