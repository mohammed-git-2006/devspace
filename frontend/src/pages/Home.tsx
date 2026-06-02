import { motion } from "framer-motion";
import ColorBends from '../bits/ColorBend'
import { useEffect, useRef, useState } from "react";
import PanelWrapper from "./components/PanelWrapper";
import BuyMeCoffe from "./components/BuyMeCoffee";
import TextType from "../bits/TextType";
import StoryPanel from "./components/StoryPanel";
import JSONPrettify from "./tools/JSONPrettify";
import JSONMinify from "./tools/JSONMinify";
import JWT from "./tools/JWT";
import HashPage from "./tools/Hash";

const tools = [
  { name: 'JWT Decoder', url: '/tools/jwt' },
  { name: 'JSON Prettify', url: '/tools/json-prettify' },
  { name: 'JSON Minify', url: '/tools/json-minify' },
  { name: 'Hash Generator (MD5/SHA256)', url: '/tools/hash' },
  { name: 'Base64 Encode/Decode', url: '/tools/base64' },
  { name: 'Regex Tester', url: '/tools/regex' },
  { name: 'URL Encoder/Decoder', url: '/tools/url' },
  { name: 'Text Case Converter', url: '/tools/text-case' },
  { name: 'Word Counter', url: '/tools/word-counter' },
  { name: 'Image Resizer', url: '/tools/image-resizer' },
  { name: 'PDF Merger', url: '/tools/pdf-merge' },
  { name: 'PDF Compressor', url: '/tools/pdf-compress' }
];

const shortcuts = {
  'jm' : 'JSON Minify',
  'jp' : 'JSON Prettify',
  'hg' : 'Hash Generator (MD5/SHA256)',
  'jd' : 'JWT Decoder',
  'bs' : 'Base64 Encode/Decode',
  'rt' : 'Regex Tester',
  'ue' : 'URL Encoder/Decoder',
  'tc' : 'Text Case Converter',
  'wc' : 'Word Counter',
  'ir' : 'Image Resizer',
  'pm' : 'PDF Merger',
  'pc' : 'PDF Compressor'
}


function NavBar({onToolSelected, selectedTool, onAnimatedChange, animated} : 
  {onToolSelected : (name:string) => void, selectedTool: string, onAnimatedChange : (v:boolean) => void,
    animated: boolean
  })
{
  const containerVariants = {
    hidden: {
    },

    enter: {
      transition: {
        staggerChildren: .2
      }
    }
  }

  const childVariants = {
    hidden: {
      opacity: 0
    },

    enter: {
      opacity: 1
    }
  }

  const [shortcutsToggled, setShortcutsToggled] = useState(false)
  const [checked, setChecked] = useState(animated)

  return (
    <div 
    className="px-6 py-4 flex flex-row gap-4 gap-x-6 items-center mx-5 mt-5 backdrop-blur-2xl
      rounded-2xl bg-gradient-to-r from-white/15 to-white/10 border border-white/20 shadow-2xl sticky top-5 left-0 z-[1500]
      "
    >

      <div className="text-white font-bold text-xl border-r-[4px] flex items-center border-[var(--accent)] pr-3 h-10 w-[300px]">
        <TextType 
          text={["DevSpace.com", "Cosmic Tools", "Code Galaxy"]}
          typingSpeed={75}
          pauseDuration={1500}
          cursorCharacter="_"
          deletingSpeed={50}
          cursorBlinkDuration={0.5}          
        />
      </div>
      <motion.ul 
      variants={containerVariants}
      initial='hidden'
      animate='enter'
      className="flex flex-row flex-wrap gap-3 gap-y-2 items-center *:cursor-pointer *:transition">
        {tools.map((e, i) => {
          return <><motion.li
            variants={childVariants}
            key={'tool-l-' + i}
            onClick={() => {
              // nav(e.url)
              onToolSelected(e.name)
            }}

            className={e.name == selectedTool ? "border-b-[3px] border-[var(--accent)] text-[var(--accent)] uppercase tracking-wide" : 
              "uppercase tracking-wide border-b-[3px] border-transparent hover:border-[var(--accent)] hover:text-[var(--accent)]"}
            >
              {e.name}
          </motion.li>
          {i-1 != tools.length && <span className="text-[var(--accent)]">•</span>}
          </>
        })
      }
      </motion.ul>
      <div className="flex flex-col gap-2 text-xs">
        <div>
          <label className="inline-flex items-center cursor-pointer ">
            <input type="checkbox" className="peer hidden"
            onChange={() => {
              onAnimatedChange(!checked)
              setChecked(!checked)
              // alert(e.target.value)
            }} checked={checked}
            />
            <span className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center
                        peer-checked:bg-[var(--accent)] peer-checked:border-[var(--accent)]
                        transition-colors duration-200">
              <svg className="hidden peer-checked:block w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="ml-2 text-sm tl">Animated</span>
          </label>

        </div>

        <button
        onClick={() => {
          setShortcutsToggled(!shortcutsToggled)
        }} 
        className="relative text-sm underline cursor-pointer td">
          Shortcuts?
          {shortcutsToggled && <div className="transition fixed z-999 top-[80px] right-[20px] bg-black/80 p-3">
            Shortcuts:
            <div className="w-full flex flex-col gap-2 items-start mt-3">
              {Object.entries(shortcuts).map(e => {
                return <div className="flex flex-row gap-3">
                  <div className="bg-white/80 text-black font-bold text-xs rounded-sm shadow-sm
                  shadow-gray-300 p-1">{e[0]}</div>
                  <div>{e[1]}</div>
                </div>
              })}
            </div>
          </div>}
        </button>
        
      </div>
    </div>
  )
}


export default function HomePage()
{
  const [tool, setTool] = useState<string>('none')
  const [_, setPrevChar] = useState('')

  const [bgAnimated, setBGAnimated] = useState(true)

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase()
      const tag = e.target.tagName.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || e.target.isContentEditable;

      if (isTyping) return; // skip if user is typing in a field

      setPrevChar(prev => {
        const combo = prev + key

        console.log(`Combo: ${combo}:[${prev} - ${key}]`)

        if (Object.keys(shortcuts).includes(combo))
          setTool(shortcuts[combo]!)

        return key

      })      
    })
  }, [])

  return (
    <>
    <div className="fixed top-0 left-0 w-full h-full pointer-events-">
      { bgAnimated ? <ColorBends
        colors={["#6A0DAD", "#8a5cff", "#8a5cff"]}
        rotation={90}
        speed={0.2}
        scale={1}
        frequency={1}
        warpStrength={1.025}
        mouseInfluence={1}
        noise={0.25}
        parallax={0.5}
        iterations={1}
        intensity={1.5}
        bandWidth={10}
        transparent
        autoRotate={0}
      /> : 
      <div className="bg-black/60 ">

      </div> }
    </div>
    <div className="w-full h-dvh flex flex-col p-0 m-0 z-999">
      <NavBar onToolSelected={(t) => {
        setTool(t)
      }} selectedTool={tool} onAnimatedChange={(v) => {
        setBGAnimated(v)
      }} animated={bgAnimated} />

      <div className="w-full flex-1 flex p-5 flex-col gap-5 items-center">
        <div className="grid grid-cols-2 gap-3 w-full">
            <BuyMeCoffe />
            <StoryPanel/>
          </div>
        {tool == 'none' && <>
          

          <PanelWrapper>
            <span className="p-3 td">
              You have not selected any tool for now 🔨 ...
            </span>
          </PanelWrapper>
        </>}

        {tool != 'none' && <>
          <PanelWrapper wMax>
            {tool == 'JSON Prettify' && <JSONPrettify/> }
            {tool == 'JSON Minify' && <JSONMinify/> }
            {tool == 'JWT Decoder' && <JWT/> }
            {tool == 'Hash Generator (MD5/SHA256)' && <HashPage/>}
            
          </PanelWrapper>
        </>}

      </div>
    </div>
    </>
  )
}