import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Alert } from "../../components/Alert/Alert";
import { getUserFriendlyMessage } from "../../Context/AuthContext";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const auth = getAuth();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center px-2"
      style={{
        backgroundImage:
          "url('/bg.jpg')",
        // Or use Unsplash: "url('https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80')"
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">Forgot Password</h1>
        <form onSubmit={handleReset} className="flex flex-col gap-4 w-full">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-center font-semibold mb-2">
              Password reset email sent! Check your inbox.
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center font-semibold mb-2">
              {getUserFriendlyMessage(error)}
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
          <input
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-2 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-all duration-300"
            type="submit"
            value="Send Reset Link"
          />
        </form>
        <div className="text-center text-base mt-2 text-gray-500">
          I remember my password{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;