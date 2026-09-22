import React, { useState, useEffect } from "react";

function Plans({ theme }) {
  const [isLight, setIsLight] = useState(theme === "light");

  useEffect(() => {
    if (theme) {
      setIsLight(theme === "light");
      return;
    }

    const checkTheme = () => {
      const sectionEl = document.getElementById("plans");
      const pageContainer = sectionEl?.closest(".min-h-screen") || document.querySelector(".min-h-screen");
      const hasLightBg = pageContainer && (
        pageContainer.className.includes("c8e8fc") || 
        pageContainer.className.includes("d8effd") || 
        pageContainer.className.includes("text-slate-800")
      );
      const isAquaActive = document.querySelector("[title*='Dark Mode']") !== null;
      setIsLight(Boolean(hasLightBg || isAquaActive));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, subtree: true, childList: true });
    return () => observer.disconnect();
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const whatsapp = e.target.whatsapp.value;
    const plan = e.target.plan.value;

    const message = `
Hello, I want to register my interest.

Full Name: ${name}
WhatsApp Number: ${whatsapp}
Interested Plan: ${plan}
`;

    const whatsappURL = `https://wa.me/919161310909?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");
  };


  return (
    <section
      id="plans"
      className={`min-h-screen py-16 px-6 transition-colors duration-500 ${
        isLight
          ? "bg-transparent text-slate-900"
          : "bg-[#202b3b] text-white"
      }`}
    >

      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="mb-12">

          <h2 className={`inline-flex items-center gap-3 text-3xl md:text-4xl font-bold border-b-2 pb-2 ${
            isLight ? "border-sky-500 text-slate-900" : "border-yellow-400 text-white"
          }`}>

            <span className={isLight ? "text-sky-600 text-4xl" : "text-yellow-400 text-4xl"}>
              ↪
            </span>

            Enrollment & Registration

          </h2>

        </div>


        <div className="grid lg:grid-cols-2 gap-12 items-start">


          {/* ================= STUDY PLANS ================= */}

          <div>

            <h3 className={`inline-block text-2xl md:text-3xl font-bold border-b-2 pb-2 ${
              isLight ? "border-sky-500 text-slate-900" : "border-yellow-400 text-white"
            }`}>

              Choose Your Ideal Study Plan

            </h3>

            <br /><br />


            <p className={`font-semibold mt-12 mb-5 ${
              isLight ? "text-sky-700" : "text-yellow-400"
            }`}>

              Select the duration that best suits your preparation goals.

            </p>
            <br /><br />


            <div className="grid sm:grid-cols-2 gap-6">


              {/* Half Day Plan */}

              <div className={`border-t-8 rounded-2xl p-6 min-h-[180px] shadow-xl hover:-translate-y-1 transition ${
                isLight
                  ? "bg-white/40 backdrop-blur-2xl border border-white/80 border-t-gray-500 text-slate-900 shadow-[0_8px_32px_rgba(0,140,255,0.08)]"
                  : "bg-[#3b4759] border-gray-500 text-white"
              }`}>

                <h4 className="text-xl font-bold">

                  Half Day Plan

                </h4>

                <p className="text-3xl font-extrabold mt-1">

                  ₹500

                </p>

                <p className={`font-semibold ${isLight ? "text-emerald-700" : "text-green-300"}`}>

                  without locker

                </p>

              </div>


              {/* 24 Hours Plan */}

              <div className={`relative border-t-8 rounded-2xl p-6 min-h-[180px] shadow-xl hover:-translate-y-1 transition ${
                isLight
                  ? "bg-white/50 backdrop-blur-2xl border border-white/80 border-t-amber-500 text-slate-900 shadow-[0_8px_32px_rgba(245,158,11,0.12)]"
                  : "bg-[#873b0e] border-orange-400 text-white"
              }`}>

                <span className="absolute right-0 top-0 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-bl-lg rounded-tr-lg">

                  BEST VALUE

                </span>


                <h4 className={`text-xl font-bold ${isLight ? "text-amber-800" : "text-yellow-300"}`}>

                  24 Hours Plan

                </h4>

                <p className={`font-semibold ${isLight ? "text-amber-700" : "text-yellow-300"}`}>

                  with locker

                </p>

                <p className="text-3xl font-extrabold mt-3">

                  ₹1,000

                </p>

                <p className={`font-semibold ${isLight ? "text-amber-600" : "text-yellow-200"}`}>

                  Free Locker 😍

                </p>

              </div>


              {/* Locker Charge */}

              <div className={`border-t-8 rounded-2xl p-6 min-h-[150px] shadow-xl hover:-translate-y-1 transition ${
                isLight
                  ? "bg-white/40 backdrop-blur-2xl border border-white/80 border-t-emerald-500 text-slate-900 shadow-[0_8px_32px_rgba(16,185,129,0.08)]"
                  : "bg-[#3b4759] border-emerald-500 text-white"
              }`}>

                <h4 className="text-xl font-bold">

                  Locker charge

                </h4>

                <p className="text-3xl font-extrabold mt-1">

                  ₹100 only

                </p>

              </div>


              {/* Full Day Plan */}

              <div className={`border-t-8 rounded-2xl p-6 min-h-[150px] shadow-xl hover:-translate-y-1 transition ${
                isLight
                  ? "bg-white/40 backdrop-blur-2xl border border-white/80 border-t-emerald-500 text-slate-900 shadow-[0_8px_32px_rgba(16,185,129,0.08)]"
                  : "bg-[#3b4759] border-emerald-500 text-white"
              }`}>

                <h4 className="text-xl font-bold">

                  Full Day Plan

                </h4>

                <p className="text-3xl font-extrabold mt-1">

                  ₹700

                </p>

                <p className={`font-semibold ${isLight ? "text-emerald-700" : "text-green-300"}`}>

                  without locker

                </p>

              </div>


            </div>

          </div>


          {/* ================= REGISTRATION FORM ================= */}

          <div className={`border-t-8 border-emerald-500 rounded-2xl p-8 md:p-10 shadow-2xl transition-all duration-300 ${
            isLight
              ? "bg-white/45 backdrop-blur-3xl border border-white/80 text-slate-900 shadow-[0_20px_60px_rgba(14,165,233,0.15)]"
              : "bg-[#0d1727] text-white"
          }`}>


            <h3 className={`inline-block text-2xl md:text-3xl font-bold border-b-2 pb-2 ${
              isLight ? "border-sky-500 text-slate-900" : "border-yellow-400 text-white"
            }`}>

              Register Your Interest

            </h3>


            <p className={`text-lg text-center mt-7 mb-8 ${isLight ? "text-slate-600" : "text-gray-300"}`}>

              Fill this quick form, and our team will call you back shortly.

            </p>


            <form onSubmit={handleSubmit}>


              {/* Full Name */}

              <label className={`block font-semibold mb-2 ${isLight ? "text-slate-700" : "text-gray-300"}`}>

                Full Name <span className={isLight ? "text-sky-600" : "text-yellow-400"}>*</span>

              </label>


              <input
                type="text"
                name="name"
                required
                placeholder="Enter your name"
                className={`w-full rounded-lg px-4 py-4 mb-5 outline-none transition shadow-sm ${
                  isLight
                    ? "bg-white/70 backdrop-blur-md border border-white/90 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white"
                    : "bg-[#3b4759] border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400"
                }`}
              />


              {/* WhatsApp Number */}

              <label className={`block font-semibold mb-2 ${isLight ? "text-slate-700" : "text-gray-300"}`}>

                WhatsApp Number <span className={isLight ? "text-sky-600" : "text-yellow-400"}>*</span>

              </label>


              <input
                type="tel"
                name="whatsapp"
                required
                pattern="[0-9]{10}"
                placeholder="Enter your 10-digit number"
                className={`w-full rounded-lg px-4 py-4 mb-5 outline-none transition shadow-sm ${
                  isLight
                    ? "bg-white/70 backdrop-blur-md border border-white/90 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white"
                    : "bg-[#3b4759] border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400"
                }`}
              />


              {/* Interested Plan */}

              <label className={`block font-semibold mb-2 ${isLight ? "text-slate-700" : "text-gray-300"}`}>

                Interested Plan

              </label>


              <select
                name="plan"
                required
                className={`w-full rounded-lg px-4 py-4 mb-6 outline-none transition shadow-sm cursor-pointer ${
                  isLight
                    ? "bg-white/70 backdrop-blur-md border border-white/90 text-slate-900 focus:border-sky-500"
                    : "bg-[#3b4759] border border-gray-600 text-white focus:border-yellow-400"
                }`}
              >

                <option value="" className={isLight ? "bg-white text-slate-900" : "bg-[#3b4759] text-white"}>
                  Select an option
                </option>

                <option value="Half Day Plan - ₹500" className={isLight ? "bg-white text-slate-900" : "bg-[#3b4759] text-white"}>
                  Half Day Plan - ₹500
                </option>

                <option value="24 Hours Plan with Locker - ₹1000" className={isLight ? "bg-white text-slate-900" : "bg-[#3b4759] text-white"}>
                  24 Hours Plan with Locker - ₹1000
                </option>

                <option value="Full Day Plan - ₹700" className={isLight ? "bg-white text-slate-900" : "bg-[#3b4759] text-white"}>
                  Full Day Plan - ₹700
                </option>

                <option value="Locker Charge - ₹100" className={isLight ? "bg-white text-slate-900" : "bg-[#3b4759] text-white"}>
                  Locker Charge - ₹100
                </option>

              </select>


              {/* Submit Button */}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 rounded-lg text-lg font-bold transition shadow-lg cursor-pointer text-white"
              >

                SUBMIT INQUIRY

              </button>


            </form>


            {/* Note */}

            <div className={`border-t mt-6 pt-5 text-sm leading-relaxed ${
              isLight ? "border-slate-300/60 text-slate-600" : "border-gray-700 text-gray-300"
            }`}>

              <span className={`font-bold ${isLight ? "text-sky-700" : "text-yellow-400"}`}>
                Note:
              </span>{" "}

              Submitting this form expresses your interest. Final registration and
              seat allocation are confirmed only after visiting the library and
              completing formalities.

            </div>


          </div>

        </div>

      </div>

    </section>
  );
}


export default Plans;