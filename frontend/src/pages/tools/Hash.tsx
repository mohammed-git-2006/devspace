import { useEffect, useRef, useState } from "react"
import CryptoJS from "crypto-js";

export default function HashPage()
{
  const algosAvailable = useRef(
    [
      {name: 'MD5'    , algo: CryptoJS.MD5}, 
      {name: 'SHA256' , algo: CryptoJS.SHA256},
      {name: 'SHA1'   , algo: CryptoJS.SHA1},
      {name: 'SHA224' , algo: CryptoJS.SHA224},
      {name: 'SHA384' , algo: CryptoJS.SHA384},
      {name: 'SHA512' , algo: CryptoJS.SHA512},
    ]
  ).current
  const [currentAlgo, setCurrentAlgo] = useState('MD5')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  useEffect(() => {
    

    setOutput(algosAvailable.find(e => e.name == currentAlgo)!.algo(input).toString() ?? '')
  }, [currentAlgo, input])

  return <div className="w-full flex flex-col p-2">
    <div className="flex flex-row gap-4 items-center justify-between">
      <span className="td text-lg font-bold">
        Hash Generator ({algosAvailable.map(e => e.name).join('/')})
      </span>

      <div className="rounded-full border-[1px] border-white/25 p-0 overflow-hidden flex flex-row gap-0
      bg-black/80 backdrop-blur-lg *:cursor-pointer *:px-3">
        {algosAvailable.map(e => {
          let selected = currentAlgo == e.name

          return <div
          onClick={() => setCurrentAlgo(e.name)}
          className={'p-2 transition ' + (selected ? 'bg-[var(--accent)] text-white' : '')}
          >{e.name}</div>
        })}
      </div>
    </div>

    <div className="w-full grid grid-cols-2 gap-5">
      <div className="flex flex-col gap-2 w-full">
        <span className="font-bold td">
          Output:
        </span>
        <ul className="flex flex-row gap-4 *:underline *:cursor-pointer text-sm">
          <li onClick={() => {
            navigator.clipboard.writeText(output)
          }}>Copy</li>
        </ul>

        <code className="bg-black/50 p-2 border-[1px] border-white/25 rounded-lg 
        text-green-500 font-bold overflow-x-auto whitespace-pre-wrap break-all">
          {input ? output : <span className="font-normal tl">Enter a text to hash</span>}
        </code>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-bold td">
          { false ? <span className="text-red-800">Failed to parse the JSON content</span> : <>Input: </> }
        </span>
        <ul className="flex flex-row gap-4 *:underline *:cursor-pointer text-sm">
          <li onClick={() => {
            navigator.clipboard.writeText(input)
          }}>Copy</li>

          <li onClick={() => {
            setInput('')
          }}>Delete</li>
        </ul>
        <textarea className="bg-black/80 rounded-lg border-2 border-white/20 w-full min-h-[500px]
          td p-2 focus:outline-none" placeholder="Input text here ..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
          }}
          >
          
          </textarea>
      </div>
    </div>
  </div>
}