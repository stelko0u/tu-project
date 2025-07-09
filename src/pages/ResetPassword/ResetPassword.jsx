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
      // alert("Password reset email sent! Check your inbox.");
      setError("");
    } catch (err) {
      console.error("Error sending reset email:", err);
      setError(err.message);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {success && (
        <Alert
          type="success"
          message="Password reset email sent! Check your inbox."
          className="absolute top-20 right-0 mt-2"
        />
      )}
      {error && (
        <Alert
          type="error"
          message={getUserFriendlyMessage(error)}
          className="absolute top-20 right-0 mt-2"
        />
      )}

      <div className="flex flex-col bg-primary p-5 text-white lg:w-1/4 rounded-md">
        <h1 className="text-3xl font-bold text-center pb-4">Forgot Password</h1>

        <form onSubmit={handleReset} className="flex flex-col gap-3 w-full">
          {error && <p className="text-red-500 text-center font-bold h-4">{error}</p>}

          <div>
            <label>Email address:</label>
            <input
              className="p-2 text-xl text-black bg-white w-full"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              value={email}
            />
          </div>

          <p className="text-center text-l">
            I remember my password{" "}
            <Link to="/login" className="text-blue-500 font-bold">
              Login
            </Link>
          </p>

          <input
            className="p-2 text-xl bg-white text-black font-bold cursor-pointer hover:bg-slate-400 hover:text-white transition-all duration-500 rounded-sm"
            type="submit"
            value="Send Reset Link"
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
