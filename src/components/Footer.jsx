import React from "react";

const Footer = () => {
  return (
    <footer className="relative bg-[#070b14] text-slate-300 mt-16 border-t border-amber-500/30 overflow-hidden font-sans">
      {/* Top subtle golden ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60"></div>
      <div className="pointer-events-none absolute left-1/2 -top-24 -translate-x-1/2 w-96 h-24 bg-amber-500/10 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Main 3 Columns - 100% Centered on Mobile & Laptop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center items-start">
          
          {/* Column 1: Library Info */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h2 className="text-2xl font-black text-amber-400 tracking-tight">
                Anytime Library
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm">
              A peaceful, comfortable and distraction-free study environment
              designed for students preparing for competitive exams,
              college studies and self learning.
            </p>
            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
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
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Avinash Singh
                </a>
              </span>{" "}
              <span className="text-slate-500 font-normal text-sm">&</span>{" "}
              <span>
                <a
                  href="tel:+916392165271"
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Devam Patel
                </a>
              </span>
            </h3>

            {/* 📍 Google Maps Linked Address */}
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              <a
                href="https://maps.app.goo.gl/qxSwKvi4itxG6rNM9"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-300 transition cursor-pointer inline-block"
                title="Open Location on Google Maps"
              >
                📍 Rajamau Road, Near Anant Sherwani's &amp; Dulha Ghar, Bachhrawan Raebareli
              </a>
            </p>

            <p className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition">
              <a href="tel:+919161310909" className="cursor-pointer inline-flex items-center gap-1">
                📞 +91 9161310909
              </a>
            </p>

            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              🕒 6:00 AM - 10:00 PM
            </p>

            <p className="text-xs sm:text-sm text-slate-400 hover:text-sky-400 transition cursor-pointer">
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
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 hover:text-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.2)] transition-all cursor-pointer"
                >
                  <span>📸</span> Instagram
                </a>
              </li>

              <li>
                <a
                  href="https://wa.me/919161310909"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all cursor-pointer"
                >
                  <span>💬</span> WhatsApp
                </a>
              </li>

              <li>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:border-sky-500/50 hover:text-sky-400 hover:shadow-[0_0_15px_rgba(14,165,233,0.2)] transition-all cursor-pointer">
                  <span>📘</span> Facebook
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar - 100% Centered */}
        <div className="border-t border-slate-800/80 mt-12 pt-8 text-center space-y-2">
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
              className="text-amber-400 font-bold hover:text-amber-300 hover:underline transition cursor-pointer"
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