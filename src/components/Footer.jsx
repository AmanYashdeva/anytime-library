import React, { useState, useEffect } from "react";

const Footer = ({ theme }) => {
  const [isLight, setIsLight] = useState(theme === "light");

  useEffect(() => {
    if (theme) {
      setIsLight(theme === "light");
      return;
    }

    const checkTheme = () => {
      const isAquaActive = document.querySelector("[title*='Dark Mode']") !== null;
      const pageContainer = document.querySelector(".min-h-screen");
      const hasLightBg = pageContainer && (
        pageContainer.className.includes("c8e8fc") || 
        pageContainer.className.includes("d8effd") || 
        pageContainer.className.includes("text-slate-800")
      );
      setIsLight(Boolean(hasLightBg || isAquaActive));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, subtree: true, childList: true });
    return () => observer.disconnect();
  }, [theme]);

  return (
    <footer className={`relative mt-16 border-t overflow-hidden font-sans transition-colors duration-500 ${
      isLight
        ? "bg-gradient-to-b from-[#0a1e38]/92 via-[#07162b]/96 to-[#040e1c] backdrop-blur-3xl border-sky-400/40 text-slate-200 shadow-[0_-20px_50px_rgba(0,35,70,0.25)]"
        : "bg-[#070b14] text-slate-300 border-amber-500/30"
    }`}>
      {/* Top subtle ambient glow */}
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
        isLight ? "via-sky-400/90 to-transparent opacity-90" : "via-amber-400 to-transparent opacity-60"
      }`}></div>
      <div className={`pointer-events-none absolute left-1/2 -top-24 -translate-x-1/2 w-96 h-24 blur-3xl rounded-full ${
        isLight ? "bg-sky-400/25" : "bg-amber-500/10"
      }`}></div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Main 3 Columns - 100% Centered on Mobile & Laptop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center items-start">
          
          {/* Column 1: Library Info */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h2 className={`text-2xl font-black tracking-tight ${
                isLight ? "text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-white drop-shadow-[0_2px_10px_rgba(56,189,248,0.3)]" : "text-amber-400"
              }`}>
                Anytime Library
              </h2>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed max-w-sm ${
              isLight ? "text-slate-300" : "text-slate-400"
            }`}>
              A peaceful, comfortable and distraction-free study environment
              designed for students preparing for competitive exams,
              college studies and self learning.
            </p>
            <div className="pt-1">
              <span className={`inline-block px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isLight
                  ? "bg-sky-400/20 text-sky-200 border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                  : "bg-amber-400/10 text-amber-400 border border-amber-400/20"
              }`}>
                ⭐ Silent Study Zone
              </span>
            </div>
          </div>

          {/* Column 2: Contact & Location */}
          <div className="flex flex-col items-center text-center space-y-2.5">
            <h3 className="text-lg font-black text-white tracking-wide">
              <span>
                <a
                  href="tel:+919219384600"
                  className={`transition cursor-pointer ${
                    isLight ? "hover:text-sky-300" : "hover:text-emerald-400"
                  }`}
                >
                  Avinash Singh
                </a>
              </span>{" "}
              <span className="text-slate-400 font-normal text-sm">&</span>{" "}
              <span>
                <a
                  href="tel:+916392165271"
                  className={`transition cursor-pointer ${
                    isLight ? "hover:text-sky-300" : "hover:text-emerald-400"
                  }`}
                >
                  Devam Patel
                </a>
              </span>
            </h3>

            {/* 📍 Google Maps Linked Address */}
            <p className={`text-xs sm:text-sm max-w-sm leading-relaxed ${
              isLight ? "text-slate-300" : "text-slate-400"
            }`}>
              <a
                href="https://maps.app.goo.gl/qxSwKvi4itxG6rNM9"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition cursor-pointer inline-block ${
                  isLight ? "hover:text-sky-300" : "hover:text-amber-300"
                }`}
                title="Open Location on Google Maps"
              >
                📍 Rajamau Road, Near Anant Sherwani's &amp; Dulha Ghar, Bachhrawan Raebareli
              </a>
            </p>

            <p className={`text-xs sm:text-sm font-semibold transition ${
              isLight ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-400 hover:text-emerald-300"
            }`}>
              <a href="tel:+919161310909" className="cursor-pointer inline-flex items-center gap-1">
                📞 +91 9161310909
              </a>
            </p>

            <p className={`text-xs sm:text-sm font-mono ${
              isLight ? "text-slate-300" : "text-slate-400"
            }`}>
              🕒 6:00 AM - 10:00 PM
            </p>

            <p className={`text-xs sm:text-sm transition cursor-pointer ${
              isLight ? "text-slate-300 hover:text-sky-300" : "text-slate-400 hover:text-sky-400"
            }`}>
              <a href="mailto:anytimelibraries@gmail.com" className="inline-flex items-center gap-1">
                📧 anytimelibraries@gmail.com
              </a>
            </p>
          </div>

          {/* Column 3: Social Links */}
          <div className="flex flex-col items-center text-center space-y-3">
            <h2 className="text-lg font-black text-white tracking-wide">
              🌐 Follow Us
            </h2>

            <ul className="flex flex-col items-center space-y-2.5 text-xs sm:text-sm font-semibold">
              <li>
                <a
                  href="https://www.instagram.com/anytime_library?stkn=ejBmaHFneGhmZWJo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                    isLight
                      ? "bg-white/10 backdrop-blur-md border-white/15 text-white hover:bg-white/20 hover:border-pink-400 hover:text-pink-300 shadow-sm"
                      : "bg-slate-900 border-slate-800 hover:border-pink-500/50 hover:text-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                  }`}
                >
                  <span>📸</span> Instagram
                </a>
              </li>

              <li>
                <a
                  href="https://wa.me/919161310909"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                    isLight
                      ? "bg-white/10 backdrop-blur-md border-white/15 text-white hover:bg-white/20 hover:border-emerald-400 hover:text-emerald-300 shadow-sm"
                      : "bg-slate-900 border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  }`}
                >
                  <span>💬</span> WhatsApp
                </a>
              </li>

              <li>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                  isLight
                    ? "bg-white/10 backdrop-blur-md border-white/15 text-slate-300 hover:bg-white/20 hover:border-sky-400 hover:text-sky-300 shadow-sm"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-sky-500/50 hover:text-sky-400 hover:shadow-[0_0_15px_rgba(14,165,233,0.2)]"
                }`}>
                  <span>📘</span> Facebook
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar - 100% Centered */}
        <div className={`border-t mt-12 pt-8 text-center space-y-2 ${
          isLight ? "border-white/15" : "border-slate-800/80"
        }`}>
          <p className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} Anytime Library. All Rights Reserved.
          </p>

          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            Made with <span className="text-rose-500 text-sm animate-pulse">❤️</span> for students
          </p>

          <p className="text-xs text-slate-400">
            Developer:{" "}
            <a
              href="https://www.linkedin.com/in/aman-yashdeva-62ba12334"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-bold hover:underline transition cursor-pointer ${
                isLight ? "text-sky-300 hover:text-sky-200" : "text-amber-400 hover:text-amber-300"
              }`}
            >
              Aman Yashdeva
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;