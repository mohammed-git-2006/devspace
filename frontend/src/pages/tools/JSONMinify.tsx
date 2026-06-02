import { useEffect, useState } from "react"

export default function JSONMinify()
{
  const [jsonInput, setJsonInput] = useState((JSON.stringify([
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  },
  {
    "id": 2,
    "name": "Ervin Howell",
    "username": "Antonette",
    "email": "Shanna@melissa.tv",
    "address": {
      "street": "Victor Plains",
      "suite": "Suite 879",
      "city": "Wisokyburgh",
      "zipcode": "90566-7771",
      "geo": {
        "lat": "-43.9509",
        "lng": "-34.4618"
      }
    },
    "phone": "010-692-6593 x09125",
    "website": "anastasia.net",
    "company": {
      "name": "Deckow-Crist",
      "catchPhrase": "Proactive didactic contingency",
      "bs": "synergize scalable supply-chains"
    }
  },
  {
    "id": 3,
    "name": "Clementine Bauch",
    "username": "Samantha",
    "email": "Nathan@yesenia.net",
    "address": {
      "street": "Douglas Extension",
      "suite": "Suite 847",
      "city": "McKenziehaven",
      "zipcode": "59590-4157",
      "geo": {
        "lat": "-68.6102",
        "lng": "-47.0653"
      }
    },
    "phone": "1-463-123-4447",
    "website": "ramiro.info",
    "company": {
      "name": "Romaguera-Jacobson",
      "catchPhrase": "Face to face bifurcated interface",
      "bs": "e-enable strategic applications"
    }
  },
  {
    "id": 4,
    "name": "Patricia Lebsack",
    "username": "Karianne",
    "email": "Julianne.OConner@kory.org",
    "address": {
      "street": "Hoeger Mall",
      "suite": "Apt. 692",
      "city": "South Elvis",
      "zipcode": "53919-4257",
      "geo": {
        "lat": "29.4572",
        "lng": "-164.2990"
      }
    },
    "phone": "493-170-9623 x156",
    "website": "kale.biz",
    "company": {
      "name": "Robel-Corkery",
      "catchPhrase": "Multi-tiered zero tolerance productivity",
      "bs": "transition cutting-edge web services"
    }
  },
], null, 2)));
  const [output, setOutput] = useState('')
  const [err, setErr] = useState<null|string>(null)


  useEffect(() => {
    const trimmedInput = jsonInput.trim()

    console.log(`NEW EVENT: trimmedInput: ${trimmedInput.slice(0, 20)}...`)
    
    if (trimmedInput.length == 0)
      return

    try {
      setOutput(JSON.stringify(JSON.parse(trimmedInput)))
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
          navigator.clipboard.writeText(output)
        }}> Copy </li>
      </ul>
      <div className="flex-1">
        {!err && (
          <div className="bg-black p-2">
            {output}
          </div>
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