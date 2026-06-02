import { Buffer } from "buffer";
import { useEffect, useState } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function decodeJWT(token:string) {
  const [header, payload] = token.split('.').slice(0, 2);
  const decode = (str:string) => JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/')));
  return {
    header: decode(header),
    payload: decode(payload)
  };
}

// Example: HMAC SHA-256 in browser
async function verifyJWT(token:string, secret:string) {
  const [headerB64, payloadB64, signatureB64] = token.split('.');
  const signingInput = `${headerB64}.${payloadB64}`;

  // Convert secret to CryptoKey
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Sign the input
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(signingInput));

  // Convert signature to base64url
  const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  // Compare with token’s signature
  return expectedSignature === signatureB64;
}



export default function JWT()
{
  const [token, setToken] = useState<string>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30')
  const [err, setErr] = useState('')
  const [output, setOutput] = useState('')
  const [secret, setSecret] = useState('')
  const [vErr, setVERR] = useState('') // secret validation error
  const [verification, setVerification] = useState<null|boolean>(null)

  useEffect(() => {
    console.log(token)
    try {
      const dR = decodeJWT(token)
      setOutput(JSON.stringify(dR, null, 2)) 
      setErr('')
    } catch(err)
    {
      console.log(`Err: ${err}`)
      setErr('FAILED_TO_DECODE')
    }
  }, [token])

  useEffect(() => {
    try {
      verifyJWT(token, secret).then(r => {
        setVerification(r)
        setVERR('')
      }).catch(err => {
        setVERR('VALIDATION_ERROR')
      })

    } catch(err)
    {
      console.log(`SECRET_EFFECT: err: ${err}`)
      setVERR('VALIDATION_ERROR')
    }
  }, [secret])
  
  return <div className="w-full h-full grid grid-cols-2 gap-5 ">
    
    <div className="flex flex-col gap-2 max-h-[600px] overflow-y-scroll scrollbar-hide" >
      <span className="font-bold td">
        <span>Output: </span>

        {!vErr && <span className={(verification ? 'text-green-500' : 'text-red-800') + ' font-bold'}>
          {verification ? 'The token is verified' : 'The token is not verified'}
        </span>}
      </span>
      
      <SyntaxHighlighter
        language="json"
        style={atomDark}
        customStyle={{ borderRadius: '0.5rem', padding: '1rem' }}
      >
        {output}
      </SyntaxHighlighter>
    </div>
    <div className="flex flex-col gap-2">
      <span className="font-bold td">
        { err ? <span className="text-red-500">Failed to parse the JSON content</span> : <>Input: </> }
      </span>
      <ul className="flex flex-row gap-4 *:underline *:cursor-pointer text-sm">
        <li onClick={() => {
          // navigator.clipboard.writeText(jsonInput)
        }}>Copy</li>

        <li onClick={() => {
          setToken('')
        }}>Delete</li>
      </ul>
      <textarea className="bg-black/80 rounded-lg border-2 border-white/20 w-full min-h-[200px]
      td p-2 focus:outline-none" placeholder="Input text here ..."
      value={token}
      onChange={(e) => {
        setToken(e.target.value)
      }}
      >
        
      </textarea>

      <span className="tl text-sm mt-4">
        * Enter the JWT secret to check if the token is verified
      </span>
      <input
      placeholder="JWT Secret ..."
      className="w-full p-2 bg-black/50 rounded-lg border border-white/25 focus:outline-none td"
      value={secret}
      onChange={(e) => setSecret(e.target.value)}
      />
    </div>
  </div>
}