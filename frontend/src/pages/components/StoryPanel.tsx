import PanelWrapper from "./PanelWrapper";

function W({children} : {children:any}) {
  return <span className="text-[var(--td)]">
    {children}
  </span>
}

export default function StoryPanel() 
{
  return <PanelWrapper title="🚀 The DevSpace Tale">
    <div>
      DevSpace.com wasn’t built by a famous coder…
      but by an <W>*unknown medicine student*</W> 🩺 who got tired of memorizing bones
      and decided to launch developer tools into orbit instead 🌌.
      Rumor has it, he’s secretly saving up to buy a car 🚗 —
      because even astronauts need wheels when they’re back on Earth!
      So every donation or coffee ☕ doesn’t just fuel the site…
      it brings him one step closer to trading anatomy books for a shiny ride.
      Support the legend, keep DevSpace glowing 💜💚, and maybe help him finally park something other than code snippets!
    </div>
  </PanelWrapper>
}