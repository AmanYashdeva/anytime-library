function Plans() {

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

    const whatsappURL = `https://wa.me/919219384600?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");
  };


  return (
    <section
      id="plans"
      className="min-h-screen bg-[#202b3b] text-white py-16 px-6"
    >

      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="mb-12">

          <h2 className="inline-flex items-center gap-3 text-3xl md:text-4xl font-bold border-b-2 border-yellow-400 pb-2">

            <span className="text-yellow-400 text-4xl">
              ↪
            </span>

            Enrollment & Registration

          </h2>

        </div>


        <div className="grid lg:grid-cols-2 gap-12 items-start">


          {/* ================= STUDY PLANS ================= */}

          <div>

            <h3 className="inline-block text-2xl md:text-3xl font-bold border-b-2 border-yellow-400 pb-2">

              Choose Your Ideal Study Plan

            </h3>

            <br /><br />


            <p className="text-yellow-400 font-semibold mt-12 mb-5">

              Select the duration that best suits your preparation goals.

            </p>
            <br /><br />


            <div className="grid sm:grid-cols-2 gap-6">


              {/* Half Day Plan */}

              <div className="bg-[#3b4759] border-t-8 border-gray-500 rounded-2xl p-6 min-h-[180px] shadow-xl hover:-translate-y-1 transition">

                <h4 className="text-xl font-bold">

                  Half Day Plan

                </h4>

                <p className="text-3xl font-extrabold mt-1">

                  ₹500

                </p>

                <p className="text-green-300 font-semibold">

                  without locker

                </p>

              </div>


              {/* 24 Hours Plan */}

              <div className="relative bg-[#873b0e] border-t-8 border-orange-400 rounded-2xl p-6 min-h-[180px] shadow-xl hover:-translate-y-1 transition">

                <span className="absolute right-0 top-0 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-bl-lg rounded-tr-lg">

                  BEST VALUE

                </span>


                <h4 className="text-xl font-bold text-yellow-300">

                  24 Hours Plan

                </h4>

                <p className="text-yellow-300 font-semibold">

                  with locker

                </p>

                <p className="text-3xl font-extrabold mt-3">

                  ₹1,000

                </p>

                <p className="text-yellow-200 font-semibold">

                  Free Locker 😍

                </p>

              </div>


              {/* Locker Charge */}

              <div className="bg-[#3b4759] border-t-8 border-emerald-500 rounded-2xl p-6 min-h-[150px] shadow-xl hover:-translate-y-1 transition">

                <h4 className="text-xl font-bold">

                  Locker charge

                </h4>

                <p className="text-3xl font-extrabold mt-1">

                  ₹100 only

                </p>

              </div>


              {/* Full Day Plan */}

              <div className="bg-[#3b4759] border-t-8 border-emerald-500 rounded-2xl p-6 min-h-[150px] shadow-xl hover:-translate-y-1 transition">

                <h4 className="text-xl font-bold">

                  Full Day Plan

                </h4>

                <p className="text-3xl font-extrabold mt-1">

                  ₹700

                </p>

                <p className="text-green-300 font-semibold">

                  without locker

                </p>

              </div>


            </div>

          </div>


          {/* ================= REGISTRATION FORM ================= */}

          <div className="bg-[#0d1727] border-t-8 border-emerald-500 rounded-2xl p-8 md:p-10 shadow-2xl">


            <h3 className="inline-block text-2xl md:text-3xl font-bold border-b-2 border-yellow-400 pb-2">

              Register Your Interest

            </h3>


            <p className="text-gray-300 text-lg text-center mt-7 mb-8">

              Fill this quick form, and our team will call you back shortly.

            </p>


            <form onSubmit={handleSubmit}>


              {/* Full Name */}

              <label className="block text-gray-300 font-semibold mb-2">

                Full Name <span className="text-yellow-400">*</span>

              </label>


              <input
                type="text"
                name="name"
                required
                placeholder="Enter your name"
                className="w-full bg-[#3b4759] border border-gray-600 rounded-lg px-4 py-4 mb-5 text-white placeholder-gray-400 outline-none focus:border-yellow-400"
              />


              {/* WhatsApp Number */}

              <label className="block text-gray-300 font-semibold mb-2">

                WhatsApp Number <span className="text-yellow-400">*</span>

              </label>


              <input
                type="tel"
                name="whatsapp"
                required
                pattern="[0-9]{10}"
                placeholder="Enter your 10-digit number"
                className="w-full bg-[#3b4759] border border-gray-600 rounded-lg px-4 py-4 mb-5 text-white placeholder-gray-400 outline-none focus:border-yellow-400"
              />


              {/* Interested Plan */}

              <label className="block text-gray-300 font-semibold mb-2">

                Interested Plan

              </label>


              <select
                name="plan"
                required
                className="w-full bg-[#3b4759] border border-gray-600 rounded-lg px-4 py-4 mb-6 text-white outline-none focus:border-yellow-400"
              >

                <option value="">
                  Select an option
                </option>

                <option value="Half Day Plan - ₹500">
                  Half Day Plan - ₹500
                </option>

                <option value="24 Hours Plan with Locker - ₹1000">
                  24 Hours Plan with Locker - ₹1000
                </option>

                <option value="Full Day Plan - ₹700">
                  Full Day Plan - ₹700
                </option>

                <option value="Locker Charge - ₹100">
                  Locker Charge - ₹100
                </option>

              </select>


              {/* Submit Button */}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 rounded-lg text-lg font-bold transition shadow-lg"
              >

                SUBMIT INQUIRY

              </button>


            </form>


            {/* Note */}

            <div className="border-t border-gray-700 mt-6 pt-5 text-gray-300 text-sm leading-relaxed">

              <span className="text-yellow-400 font-bold">
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