import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const StudentLogin = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    alert("Login successful!");

    onLoginSuccess(user);

  } catch (error) {
    console.log("Login Error:", error);

    alert("Invalid email or password");
  }
};

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">📚</div>

          <h2 className="text-3xl font-black text-gray-900">
            Student Login
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Login to continue to Any Time Library
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-900 py-4 font-black text-white shadow-lg transition hover:-translate-y-1"
          >
            Login
          </button>

        </form>

        <button
          onClick={onClose}
          className="mt-5 w-full text-sm font-semibold text-gray-500 hover:text-gray-900"
        >
          Close
        </button>

      </div>

    </div>
  );
};

export default StudentLogin;