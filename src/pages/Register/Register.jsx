import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getUserFriendlyMessage } from "../../Context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        phone,
        email,
      });
      navigate("/");
    } catch (error) {
      const errorMessage = getUserFriendlyMessage(error.code);
      setError(errorMessage);
    }
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
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">Register</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center font-semibold mb-2">
              {error}
            </div>
          )}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Name:</label>
            <input
              className="input input-bordered w-full bg-blue-50 text-black"
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              value={name}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Phone number:</label>
            <input
              className="input input-bordered w-full bg-blue-50 text-black"
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              required
              value={phone}
              placeholder="Enter your phone number"
            />
          </div>
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
              value={password}
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Confirm password:</label>
            <input
              className="input input-bordered w-full bg-blue-50 text-black"
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
              value={confirmPassword}
              placeholder="Confirm your password"
            />
          </div>
          <div className="text-center text-base text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Login
            </Link>
          </div>
          <input
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-2 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-all duration-300"
            type="submit"
            value="Register"
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
