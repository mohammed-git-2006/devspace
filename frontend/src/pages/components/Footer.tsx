export default function Footer() {
  return (
    <footer className="bg-[var(--bg-color)] text-[var(--td)] py-6 mt-10 border-t border-[var(--accent)]">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left side */}
        <div className="text-sm">
          <p>© {new Date().getFullYear()} DevSpace — Cosmic Tools for Earthly Coders 🚀</p>
          <p className="mt-1 opacity-70">
            Built by an unknown med student 🩺 who may or may not have discovered 
            a secret formula for infinite coffee ☕…
          </p>
        </div>

        {/* Right side */}
        {/* <div className="mt-4 md:mt-0 flex items-center gap-4">
          <a href="/about" className="hover:text-[var(--accent)] transition-colors">
            About
          </a>
          <a href="/support" className="hover:text-[var(--accent)] transition-colors">
            Support
          </a>
          <a href="/mystery" className="hover:text-[var(--accent)] transition-colors">
            Mystery
          </a>
        </div> */}
      </div>

      {/* Hidden silly mystery */}
      <div className="text-center mt-4 text-xs opacity-60">
        <p>
          Psst… rumor says if you type <code>🚀+☕</code> at midnight, 
          a hidden tool unlocks. Or maybe it just makes me dance. 💃🌙
        </p>
      </div>
    </footer>
  );
}
