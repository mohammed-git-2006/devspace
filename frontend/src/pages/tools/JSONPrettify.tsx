import { useEffect, useState } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'


export default function JSONPrettify()
{
  const [jsonInput, setJsonInput] = useState('')

  const [prettifiedOutput, setPrettifiedOutput] = useState('')
  const [err, setErr] = useState<null|string>(null)


  useEffect(() => {
    const trimmedInput = jsonInput.trim()

    console.log(`NEW EVENT: trimmedInput: ${trimmedInput.slice(0, 20)}...`)
    
    if (trimmedInput.length == 0)
      return

    try {
      setPrettifiedOutput(JSON.stringify(JSON.parse(trimmedInput), null, 2))
    } catch(err)
    {
      console.log(`ERR IN PARSING: ${err}`)
      setErr('FAILED_TO_PARSE_JSON')
      return;
    }

    setErr(null)

    // prettify the content for VIEW (coloring, ...)
  }, [jsonInput])

  return <div className="w-full h-full grid grid-cols-2 gap-5 ">
    
    <div className="flex flex-col gap-2 max-h-[600px] overflow-y-scroll scrollbar-hide" >
      <span className="font-bold td">
        Output: 
        {/* { err ? <span className="text-red-800">Failed to parse the JSON content</span> : <>Input: </> } */}
      </span>
      <ul className="flex flex-row gap-4 *:underline *:cursor-pointer text-sm">
        <li onClick={() => {
          navigator.clipboard.writeText(prettifiedOutput)
        }}>Copy</li>
      </ul>
      <div className="flex-1">
        {!err && (
          <SyntaxHighlighter
            language="json"
            style={atomDark}
            customStyle={{ borderRadius: '0.5rem', padding: '1rem' }}
          >
            {prettifiedOutput}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <span className="font-bold td">
        { err ? <span className="text-red-800">Failed to parse the JSON content</span> : <>Input: </> }
      </span>
      <ul className="flex flex-row gap-4 *:underline *:cursor-pointer text-sm">
        <li onClick={() => {
          navigator.clipboard.writeText(jsonInput)
        }}>Copy</li>

        <li onClick={() => {
          setJsonInput('')
        }}>Delete</li>
      </ul>
      <textarea className="bg-black/80 rounded-lg border-2 border-white/20 w-full min-h-[300px]
      td p-2 focus:outline-none text-sm" placeholder="Input text here ..."
      value={jsonInput}
      onChange={(e) => {
        setJsonInput(e.target.value)
      }}
      >
      </textarea>
    </div>
  </div>
}