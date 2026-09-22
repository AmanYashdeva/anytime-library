import React, { useState, useEffect } from "react";

const Buttons = ({ onSignUp, onSignIn, onAdminLoginClick, theme }) => {
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
    <div className="fixed top-4 right-4 z-50 gap-2 flex">

      {/* <button
        onClick={onSignUp}
        className="bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2 rounded-lg font-bold transition"
      >
        Sign Up
      </button>

      <button
        onClick={onSignIn}
        className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-2 py-1 rounded-lg font-bold transition"
      >
        Sign In
      </button> */}
      <br />
      <button
        onClick={onAdminLoginClick}
        className={`px-5 py-2 rounded-xl font-bold transition-all duration-300 cursor-pointer ${
          isLight
            ? "bg-white/45 backdrop-blur-2xl border border-white/90 text-slate-900 shadow-[0_8px_25px_rgba(14,165,233,0.25)] hover:bg-white/65 hover:scale-105 active:scale-95"
            : "bg-yellow-400 text-black shadow-xl hover:bg-yellow-300"
        }`}
      >
        Admin Login
      </button>

    </div>
  );
};

export default Buttons;