import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getUserFriendlyMessage } from "../../Context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
        navigate("/");
      })
      .catch((error) => {
        const errorMessage = getUserFriendlyMessage(error.code);
        setError(errorMessage);
      });

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  }

  return (
    <div
      className="flex justify-center items-center overflow-auto h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="flex flex-col bg-primary p-5 text-white lg:w-1/4 rounded-lg">
        <h1 className="text-3xl font-bold text-center pb-4">Register</h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-3 w-full">
          <span className="h-4 mb-6">
            {error && <p className="text-red-500 text-center font-bold">{error}</p>}
          </span>
          <span>
            <label>Email address:</label>
            <input
              className="p-2 text-xl flex text-black bg-white w-full"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              value={email}
            />
          </span>
          <span>
            <label>Password:</label>
            <input
              className="p-2 text-xl flex text-black bg-white w-full"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </span>
          <span>
            <label>Confirm password:</label>
            <input
              className="p-2 text-xl flex text-black bg-white w-full"
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
            />
          </span>
          <p className="text-center text-l">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 font-bold">
              Login
            </Link>
          </p>
          <input
            className="p-2 text-xl bg-white text-black cursor-pointer hover:bg-slate-400 hover:text-white transition-all duration-500 rounded-sm"
            type="submit"
            value="Register"
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
