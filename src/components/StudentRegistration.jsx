import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const StudentRegistration = ({ onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Firebase Authentication me account create
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // 2️⃣ Student ki extra information Firestore me save
      await setDoc(doc(db, "students", user.uid), {
        uid: user.uid,
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      // 3️⃣ Form reset
      setFormData({
        name: "",
        mobile: "",
        email: "",
        password: "",
      });

      // 4️⃣ Registration ke baad Login Page open
      if (onRegistrationComplete) {
        onRegistrationComplete();
      }

    } catch (error) {
      console.error("Registration Error:", error);

      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6">

      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.35)]">

        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* LEFT PREMIUM BRAND SECTION */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-950 p-8 sm:p-10 lg:p-12 text-white">

            {/* Decorative circles */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-yellow-400/10"></div>
            <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-indigo-400/10"></div>

            <div className="relative z-10 flex h-full flex-col justify-between">

              <div>
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-2xl shadow-lg">
                    📚
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[3px] text-yellow-300">
                      Welcome To
                    </p>

                    <h2 className="text-xl font-black tracking-wide">
                      ANY TIME LIBRARY
                    </h2>
                  </div>
                </div>

                <h1 className="text-3xl font-black leading-tight sm:text-4xl">
                  Your Smart Study
                  <span className="block text-yellow-300">
                    Journey Starts Here.
                  </span>
                </h1>

                <p className="mt-5 max-w-md text-sm leading-7 text-indigo-100 sm:text-base">
                  Create your student account and get access to a peaceful,
                  secure and premium study environment.
                </p>
              </div>

              {/* BENEFITS */}
              <div className="mt-10 space-y-4">

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl">🪑</div>

                  <div>
                    <p className="font-bold">Premium Smart Seating</p>
                    <p className="text-xs text-indigo-200">
                      Choose and manage your preferred seat
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl">🔒</div>

                  <div>
                    <p className="font-bold">Safe & Secure</p>
                    <p className="text-xs text-indigo-200">
                      Your personal information stays protected
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl">📊</div>

                  <div>
                    <p className="font-bold">Smart Account Access</p>
                    <p className="text-xs text-indigo-200">
                      Manage your library journey easily
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>


          {/* RIGHT REGISTRATION FORM */}
          <div className="bg-white p-7 sm:p-10 lg:p-12">

            <div className="mx-auto max-w-md">

              {/* FORM HEADER */}
              <div className="mb-8">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
                  ✨ STUDENT ACCOUNT
                </div>

                <h2 className="text-3xl font-black tracking-tight text-gray-900">
                  Create Your Account
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Register now to continue with Any Time Library.
                </p>

              </div>


              <form onSubmit={handleSubmit} className="space-y-5">

                {/* FULL NAME */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Full Name
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      👤
                    </span>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />

                  </div>
                </div>


                {/* MOBILE */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Mobile Number
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      📱
                    </span>

                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      required
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />

                  </div>
                </div>


                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Email Address
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      ✉️
                    </span>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />

                  </div>
                </div>


                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Password
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      🔐
                    </span>

                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      required
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />

                  </div>
                </div>


                {/* TERMS */}
                <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">

                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 accent-indigo-600"
                  />

                  <p className="text-xs leading-5 text-gray-500">
                    I agree to the library rules and confirm that the information
                    provided by me is correct.
                  </p>

                </div>


                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-900 py-4 font-black text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/30"
                >
                  <span>Create Student Account</span>

                  <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>

              </form>

              <p className="mt-6 text-center text-xs text-gray-400">
                🔒 Your information is kept secure and private.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentRegistration;