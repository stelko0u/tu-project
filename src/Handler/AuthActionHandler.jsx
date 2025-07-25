// /pages/AuthActionHandler/AuthActionHandler.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAuth, applyActionCode, verifyPasswordResetCode } from "firebase/auth";

export default function AuthActionHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const mode = searchParams.get("mode");
  const actionCode = searchParams.get("oobCode");

  useEffect(() => {
    if (!mode || !actionCode) {
      navigate("/invalid-action");
      return;
    }

    switch (mode) {
      case "verifyEmail":
        applyActionCode(auth, actionCode)
          .then(() => {
            navigate("/verify-email");
          })
          .catch(() => {
            navigate("/verify-email?error=true");
          });
        break;

      case "resetPassword":
        verifyPasswordResetCode(auth, actionCode)
          .then(() => {
            navigate(`/reset-password?oobCode=${actionCode}`);
          })
          .catch(() => {
            navigate("/reset-password?status=error");
          });
        break;

      default:
        navigate("/unsupported-action");
        break;
    }
  }, [mode, actionCode, auth, navigate]);

  return <p>Зареждане...</p>;
}
