import { useSearchParams } from "react-router-dom";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const hasError = searchParams.get("error");

  const status = hasError ? "error" : "success";

  const getMessage = () => {
    switch (status) {
      case "loading":
        return { text: "Confirming email...", color: "text-blue-600" };
      case "success":
        return {
          text: "✅ Email confirmed successfully!",
          color: "text-green-600",
        };
      case "error":
        return {
          text: "❌ An error occurred while verifying email.",
          color: "text-red-600",
        };
      case "invalid":
        return {
          text: "❗ Invalid link or missing code..",
          color: "text-yellow-600",
        };
      default:
        return { text: "", color: "" };
    }
  };

  const { text, color } = getMessage();

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center px-2"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80')",
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 text-center flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-blue-700">Email Verification</h1>
        <p className={`text-lg font-semibold ${color}`}>{text}</p>
      </div>
    </div>
  );
}
