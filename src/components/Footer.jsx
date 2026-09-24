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

          {/* Column 3: Social Links with Clean SVGs */}
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
                  className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                    isLight
                      ? "bg-white/10 backdrop-blur-md border-white/15 text-white hover:bg-white/20 hover:border-pink-400 hover:text-pink-300 shadow-sm"
                      : "bg-slate-900 border-slate-800 hover:border-pink-500/50 hover:text-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                  }`}
                >
                  {/* Instagram Logo SVG */}
                  <svg className="w-4 h-4 fill-current text-pink-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              </li>

              <li>
                <a
                  href="https://wa.me/919161310909"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                    isLight
                      ? "bg-white/10 backdrop-blur-md border-white/15 text-white hover:bg-white/20 hover:border-emerald-400 hover:text-emerald-300 shadow-sm"
                      : "bg-slate-900 border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  }`}
                >
                  {/* WhatsApp Logo SVG */}
                  <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 3C8.83 3 3 8.83 3 16c0 2.3.6 4.55 1.74 6.53L3 29l6.67-1.7A12.94 12.94 0 0 0 16 29c7.17 0 13-5.83 13-13S23.17 3 16 3Zm0 23.64c-2.04 0-4.03-.55-5.77-1.59l-.41-.24-3.96 1.01 1.06-3.86-.27-.4A10.6 10.6 0 0 1 5.36 16C5.36 10.12 10.12 5.36 16 5.36S26.64 10.12 26.64 16 21.88 26.64 16 26.64Zm5.83-7.94c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.68.08-1.89-.94-3.13-1.68-4.38-3.81-.33-.57.33-.53.94-1.76.1-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.76.75.32 1.34.51 1.8.65.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </li>

              <li>
                <span className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                  isLight
                    ? "bg-white/10 backdrop-blur-md border-white/15 text-slate-300 hover:bg-white/20 hover:border-sky-400 hover:text-sky-300 shadow-sm"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-sky-500/50 hover:text-sky-400 hover:shadow-[0_0_15px_rgba(14,165,233,0.2)]"
                }`}>
                  {/* Facebook Logo SVG */}
                  <svg className="w-4 h-4 fill-current text-sky-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
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