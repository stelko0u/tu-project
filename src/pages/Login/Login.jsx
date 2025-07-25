import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getUserFriendlyMessage } from "../../Context/AuthContext";

// You can use '/bg.jpg' or try a free Unsplash image like:
// https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const auth = getAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        const errorMessage = getUserFriendlyMessage(error.code);
        setError(errorMessage);
      });
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center px-2"
      style={{
        backgroundImage:
          // "url('/bg.jpg')",
          "url('https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80')",
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center font-semibold mb-2">
              {error}
            </div>
          )}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Email address:</label>
            <input
              className="input input-bordered w-full bg-blue-50 text-black"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              value={email}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Password:</label>
            <input
              className="input input-bordered w-full bg-blue-50 text-black"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="Enter your password"
            />
          </div>
          <input
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-2 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-all duration-300"
            type="submit"
            value="Login"
          />
        </form>
        <div className="flex flex-col gap-2 mt-2 text-center text-base text-gray-500">
          <span>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Register
            </Link>
          </span>
          <span className="text-gray-500">
            Forgot password?{" "}
            <Link to="/forgot-password" className="text-blue-600 font-bold hover:underline">
              Forgot Password
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
