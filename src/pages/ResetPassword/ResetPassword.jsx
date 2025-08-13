import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAuth, confirmPasswordReset } from "firebase/auth";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const oobCode = searchParams.get("oobCode");
  const hasErrorParam = searchParams.get("status") === "error";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(hasErrorParam ? "invalid" : "idle");
  const [error, setError] = useState("");

  const getMessage = () => {
    switch (status) {
      case "loading":
        return { text: "Reset password...", color: "text-blue-600" };
      case "success":
        return {
          text: "✅ Password successfully changed! Redirecting to login...",
          color: "text-green-600",
        };
      case "invalid":
        return {
          text: "❗ The link is invalid or expired.",
          color: "text-yellow-600",
        };
      case "error":
        return {
          text: error || "❌ Error resetting password.",
          color: "text-red-600",
        };
      default:
        return { text: "", color: "" };
    }
  };

  const { text, color } = getMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setStatus("error");
      setError("The password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setError("Passwords don't match.");
      return;
    }

    setStatus("loading");

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus("success");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Password reset failed. Link may have expired.");
    }
  };

  if (!oobCode) return null;

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center px-2"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80')",
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 text-center flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-blue-700">Reset Password</h1>
        <p className={`text-lg font-semibold ${color}`}>{text}</p>

        {status === "idle" || status === "error" ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New password"
              className="border rounded-lg p-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm password"
              className="border rounded-lg p-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save new password
            </button>
          </form>
        ) : null}

        {status === "success" && (
          <p className="text-sm text-gray-500">You will be redirected in 3 seconds...</p>
        )}
      </div>
    </div>
  );
}
