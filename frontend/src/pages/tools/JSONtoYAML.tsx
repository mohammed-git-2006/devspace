import { useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import YAML from 'yaml'
import { atomDark, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { vsDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

export default function JsonToYaml()
{
  const [jsonInput, setJsonInput] = useState(`{
    "name": "Mohammed Rawashdeh",
    "age": 18,
    }`)

  const [err, setErr] = useState('')
  const [output, setOutput] = useState('')


  useEffect(() => {
    try 
    {
      const doc = new YAML.Document()
      doc.contents = JSON.parse(jsonInput.trim())
      setOutput(doc.toString())
      setErr('')

    } catch(Err)
    {
      setErr('FAILED_TO_PARSE')
      setOutput('')

    }
  }, [jsonInput])

  return <div className='w-full grid grid-cols-2 gap-5'>
    <div className='flex flex-col gap-2'>
      <span className='tl text-sm'>
        {err ? <span className='text-red-800'>Failed to parse your JSON input</span> : <>Output:</> }
      </span>

      <ul className="flex flex-row gap-4 *:underline *:cursor-pointer text-sm">
        <li onClick={() => {
          navigator.clipboard.writeText(output)
        }}> Copy </li>
      </ul>
      
      
      <SyntaxHighlighter
        language="yaml"
        // style={atomDark}
        customStyle={{ borderRadius: '0.5rem', padding: '1rem' }}>
      
        {output}
      </SyntaxHighlighter>
    </div>
    <div className="relative w-full flex flex-col gap-2">
      {/* Editable textarea */}
      <span className='tl text-sm'>
        Input: 
      </span>

      <ul className="flex flex-row gap-4 *:underline *:cursor-pointer text-sm">
        <li onClick={() => {
          navigator.clipboard.writeText(jsonInput)
        }}>Copy</li>

        <li onClick={() => {
          setJsonInput('')
        }}>Delete</li>
      </ul>


      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        className='bg-black/80 rounded-lg border-2 border-white/20 w-full min-h-[500px]
            td p-2 focus:outline-none text-sm'
        // className="absolute inset-0 w-full h-full resize-none bg-transparent text-transparent caret-white z-10 p-3 font-mono"
        spellCheck="false"
      />
    </div>
  </div>
}