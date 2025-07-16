import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export function AdminGuard({ children }) {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.email !== "admin@admin.com") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  return user?.email === "admin@admin.com" ? children : null;
}
