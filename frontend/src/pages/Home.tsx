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
import Footer from "./components/Footer";
import Base64 from "./tools/Base64";
import RegexTester from "./tools/RegexTester";
import URL from "./tools/URL";
import TextCaseConverter from "./tools/TextCaseConverter";
import WordCounter from "./tools/WordCounter";
import HTTPTester from "./tools/HTTPTester";
import ColorUtils from "./tools/ColorUtils";
import DiffChecker from "./tools/DiffChecker";
import PixelBlast from "../bits/PixelBlast";

const tools = [
  { name: 'JWT Decoder' , url: '/tools/jwt' },
  { name: 'JSON Prettify', url: '/tools/json-prettify' },
  { name: 'JSON Minify', url: '/tools/json-minify' },
  { name: 'Hash Generator (MD5/SHA256)', url: '/tools/hash' },
  { name: 'Base64 Encode/Decode', url: '/tools/base64' },
  { name: 'Regex Tester', url: '/tools/regex' },
  { name: 'URL Encoder/Decoder', url: '/tools/url' },
  { name: 'Text Case Converter', url: '/tools/text-case' },
  { name: 'Word Counter', url: '/tools/word-counter' },
  { name: 'HTTP'},
  { name: 'Color Utils'},
  { name: 'Diff Checker'}
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
  'ht' : 'HTTP', // A Postmail like mini version,
  'cu' : 'Color Utils',
  'dc' : 'Diff Checker',
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
    className="px-4 py-2.5 flex flex-row gap-3 gap-x-4 items-center mx-4 mt-4 backdrop-blur-2xl
      rounded-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/15 shadow-lg sticky top-4 left-0 z-[1500]
      "
    >

      <div className="text-white font-bold text-lg border-r-[3px] flex items-center border-[var(--accent)] pr-2.5 h-8 w-40 flex-shrink-0">
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
      className="flex-1 scrollbar-hide flex flex-wrap gap-2.5 gap-y-1 items-center justify-center *:cursor-pointer *:transition text-sm ">
        {tools.map((e, i) => {
          return <><motion.li
            variants={childVariants}
            key={'tool-l-' + i}
            onClick={() => {
              // nav(e.url)
              onToolSelected(e.name)
            }}

            className={e.name == selectedTool ? "border-b-[2px] border-[var(--accent)] text-[var(--accent)] uppercase tracking-wide whitespace-nowrap text-xs" : 
              "uppercase tracking-wide border-b-[2px] border-transparent hover:border-[var(--accent)] hover:text-[var(--accent)] whitespace-nowrap text-xs"}
            >
              {e.name}
          </motion.li>
          {i-1 != tools.length && <span className="text-[var(--accent)] text-opacity-50">•</span>}
          </>
        })
      }
      </motion.ul>
      <div className="flex flex-row gap-3 text-xs ml-auto items-center flex-shrink-0">
        <label className="inline-flex items-center cursor-pointer ">
          <input type="checkbox" className="peer hidden"
          onChange={() => {
            onAnimatedChange(!checked)
            setChecked(!checked)
            // alert(e.target.value)
          }} checked={checked}
          />
          <span className="w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center
                      peer-checked:bg-[var(--accent)] peer-checked:border-[var(--accent)]
                      transition-colors duration-200">
            <svg className="hidden peer-checked:block w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span className="ml-1.5 text-xs tl whitespace-nowrap">Animated</span>
        </label>

        <button
        onClick={() => {
          setShortcutsToggled(!shortcutsToggled)
        }} 
        className="relative text-xs underline cursor-pointer td whitespace-nowrap hover:text-[var(--accent)] transition">
          Shortcuts?
          {shortcutsToggled && <div className="transition fixed z-999 top-[70px] right-[20px] bg-black/90 p-2.5 rounded-lg border border-white/10">
            <span className="text-xs font-semibold block mb-2">Shortcuts:</span>
            <div className="w-full flex flex-col gap-1.5 items-start">
              {Object.entries(shortcuts).map(e => {
                return <div className="flex flex-row gap-2.5" key={e[0]}>
                  <div className="bg-white/80 text-black font-bold text-xs rounded-sm shadow-sm
                  shadow-gray-300 px-1.5 py-0.5">{e[0]}</div>
                  <div className="text-xs text-gray-300">{e[1]}</div>
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
      { bgAnimated ? <PixelBlast
    variant="square"
    pixelSize={4}
    color="#9D4EDD"
    patternScale={2}
    patternDensity={1}
    pixelSizeJitter={0}
    enableRipples
    rippleSpeed={0.4}
    rippleThickness={0.12}
    rippleIntensityScale={1.5}
    liquid={false}
    liquidStrength={0.12}
    liquidRadius={1.2}
    liquidWobbleSpeed={5}
    speed={0.5}
    edgeFade={0.25}
    transparent
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
            {tool == 'Base64 Encode/Decode' && <Base64/>}
            {tool == 'Regex Tester' && <RegexTester/>}
            {tool == 'URL Encoder/Decoder' && <URL/>}
            {tool == 'Text Case Converter' && <TextCaseConverter/>}
            {tool == 'Word Counter' && <WordCounter/>}
            {tool == 'HTTP' && <HTTPTester/>}
            {tool == 'Color Utils' && <ColorUtils/> }
            {tool == 'Diff Checker' && <DiffChecker/> }
            {/**
             * { name: 'Color Utils'},
                { name: 'Diff Checker'}
             */}
            
          </PanelWrapper>
        </>}

      </div>
    </div>
    {/* <Footer/> */}
    </>
  )
}