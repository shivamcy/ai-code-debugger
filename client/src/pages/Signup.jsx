import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "success" | "error"
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("https://ai-code-debugger.onrender.com/api/auth/signup", {
        email,
        password,
      });
      setMessage({ text: "Signup successful! Redirecting to login...", type: "success" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errMsg = error.response?.data?.error || "Signup failed! Already registered user.";
      setMessage({ text: errMsg, type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="text-center py-6 text-4xl font-extrabold tracking-wide bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 text-transparent bg-clip-text">
        AI Code Debugger
      </header>

      {/* Body */}
      <main className="flex flex-1">
        {/* Left: Signup */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-2xl p-8 w-full max-w-sm">
            <h2 className="text-2xl font-semibold mb-6 text-center">Signup</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              onClick={handleSignup}
              className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Sign Up
            </button>

            {/* Success or Error Message */}
            {message.text && (
              <p
                className={`mt-4 text-center font-medium ${
                  message.type === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {message.text}
              </p>
            )}

            <p className="mt-4 text-center text-sm text-gray-300">
              Already have an account?{" "}
              <Link to="/login" className="text-white underline hover:text-gray-300">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Right: Code Animation */}
        <div className="flex-1 hidden md:flex items-center justify-center p-4">
          <pre className="text-sm font-mono text-left bg-black rounded-lg p-6 border border-white/10 w-full max-w-md h-[400px] overflow-hidden animate-pulse leading-6 shadow-inner text-green-300">
<span className="text-purple-400">const</span> registerUser <span className="text-pink-400">=</span> <span className="text-yellow-400">async</span> () <span className="text-pink-400">=&gt;</span> {"{"}
  {"\n  "}<span className="text-blue-400">try</span> {"{"}
  {"\n    "}console.<span className="text-pink-300">log</span>(<span className="text-emerald-300">"Creating account..."</span>);
  {"\n    "}<span className="text-purple-400">await</span> signup(<span className="text-teal-400">credentials</span>);
  {"\n  "}{"}"} <span className="text-blue-400">catch</span> (e) {"{"}
  {"\n    "}console.<span className="text-pink-300">error</span>(e);
  {"\n  "}{"}"}
{"\n"}{"}"};
{"\n"}
registerUser();
          </pre>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-400">
        Created by{" "}
        <a
          href="https://github.com/shivamcy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline hover:text-gray-300"
        >
          shivamcy
        </a>
      </footer>
    </div>
  );
};

export default Signup;
