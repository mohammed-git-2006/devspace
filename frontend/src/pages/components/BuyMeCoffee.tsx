import PanelWrapper from "./PanelWrapper";
import ButtonImage from '../../bmc.png'

export default function BuyMeCoffe()
{
  return <PanelWrapper title="☕🚀 Support DevSpace" hMax>
    <div className="flex flex-col gap-2 h-full text-sm">
      <p className="leading-relaxed flex-1 ">
        Hey there, cosmic traveler 🌌✨ — keeping this toolbox orbiting smoothly takes fuel!
        If you’ve found it useful, consider <span className="text-[var(--accent)] font-semibold">buying me a coffee ☕</span>
        (or maybe a rocket snack 🍪) to keep the engines humming.
        Your support makes me do a little happy moonwalk 💃🌙 and keeps DevSpace glowing 💜💚.
      </p>
      {/* <button
      onClick={() => {
        // alert('BMC')
      }}
      className="mt-3 px-4 py-2 animate-bounce rounded-md bg-[var(--accent)] 
      text-[var(--td)] font-bold hover:shadow-[0_0_12px_var(--accent)] transition overflow-hidden">
        ❤️ Donate / Buy Me a Coffee

      </button> */}

      {/* <script type='text/javascript' src='https://storage.ko-fi.com/cdn/widget/Widget_2.js'></script><script type='text/javascript'>kofiwidget2.init('Support me on Ko-fi', '#9D4EDD', 'X2G520MG1Q');kofiwidget2.draw();</script>  */}
<a href='https://ko-fi.com/X2G520MG1Q' target='_blank'><img  className="border-0 h-10" src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' alt='Buy Me a Coffee at ko-fi.com' /></a>
      {/* <div>
        <a href="https://ko-fi.com/devspace"
        className="animate-bounce"
        target="_blank" rel="noopener noreferrer"><img src={ButtonImage} className="bg-transparent h-10 w-min"/> </a>
      </div> */}

    </div>
  </PanelWrapper>
}

// export default function BuyMeCoffe()
// {
//   return <iframe id='kofiframe' 
//   src='https://ko-fi.com/devspace/?hidefeed=true&widget=true&embed=true&preview=true' 
//   // style='border:none;width:100%;padding:4px;background:#f9f9f9;' height='712' 
//   // style={{}}
//   className="border-0 width-full p-4 bg-[var(--accent)] h-full w-full"
//   title='devspace'></iframe>
// }