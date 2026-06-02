import { motion } from "framer-motion"

// export default function PanelWrapper({children, title, wMin, hMax, wMax} : 
//   {children?: React.ReactNode, title?:string, wMin?: any, hMax?:any, wMax?:any})
// {
//   return <div className={"backdrop-blur-lg bg-black/60 rounded-xl shadow-sm p-3" + 
//   " flex flex-col border-white/35 border-[3px] " + (wMin ? ' w-min ' : '') + (hMax ? ' h-full ' : ' h-min ') + 
//   (wMax ? ' w-full ' : '')}>
//     {title && <span className="text-lg text-white cursor-pointer transition hover:text-[var(--accent)]
//     hover:translate-x-2 mb-2 ">
//       • {title} •
//     </span>}
//     {children??<></>}
//   </div>
// }

export default function PanelWrapper({children, title, wMin, hMax, wMax} : 
  {children?: React.ReactNode, title?:string, wMin?: any, hMax?:any, wMax?:any})
{
  return <div
    className={"backdrop-blur-lg bg-gradient-to-br from-white/10 via-black/40 to-black/60 rounded-2xl shadow-2xl p-4 border border-white/25" + 
    " transition duration-[.15s] hover:backdrop-blur-[1px] " + " flex flex-col " + (wMin ? ' w-min ' : '') + (hMax ? ' h-full ' : ' h-min ') + 
    (wMax ? ' w-full ' : '')}>
    {title && <motion.span 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="text-lg text-white cursor-pointer transition hover:text-[var(--accent)]
      hover:translate-x-2 mb-3 font-semibold">
        • {title} •
      </motion.span>}
    {children??<></>}
  </div>

  return <div>
    {children}
  </div>
}


