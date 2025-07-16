import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

const alertStyles = {
  success: {
    icon: <CheckCircle className="text-green-600" />,
    bg: "bg-green-100",
    text: "text-green-800",
  },
  error: {
    icon: <AlertCircle className="text-red-600" />,
    bg: "bg-red-100",
    text: "text-red-800",
  },
  warning: {
    icon: <AlertTriangle className="text-yellow-600" />,
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  info: {
    icon: <Info className="text-blue-600" />,
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
};

export function Alert({ type = "info", message, className = "", onClose }) {
  const style = alertStyles[type] || alertStyles.info;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-2xl shadow-sm ${style.bg} ${style.text} ${className}`}
    >
      {style.icon}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose}>
          <X className={`w-4 h-4 ${style.text}`} />
        </button>
      )}
    </div>
  );
}
