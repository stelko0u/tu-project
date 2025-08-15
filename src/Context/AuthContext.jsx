import { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { registerUserActivity } from "../services/lastActive.jsx";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = getAuth();
  const db = getFirestore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersMeta, setUsersMeta] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [auth]);
  useEffect(() => {
    let stopActivity;
    if (user) {
      stopActivity = registerUserActivity();
    }
    return () => {
      if (stopActivity) stopActivity();
    };
  }, [user]);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsub = onSnapshot(usersRef, (snap) => {
      const meta = {};
      snap.forEach((doc) => {
        const data = doc.data();
        meta[data.email] = {
          lastActive: user || null,
          ...data,
        };
      });
      setUsersMeta(meta);
    });
    return () => unsub();
  }, [db]);

  const values = {
    user,
    isAuthenticated: !!user,
    usersMeta,
  };

  return <AuthContext.Provider value={values}>{!loading && children}</AuthContext.Provider>;
}

export const FireBaseErrors = {
  InvalidEmail: "auth/invalid-email",
  MissingEmail: "auth/missing-email",
  WrongPassword: "auth/wrong-password",
  EmailAlreadyUse: "auth/email-already-in-use",
  TooManyRequests: "auth/too-many-requests",
  UserNotFound: "auth/user-not-found",
};
export const getFriendlyMessages = (error) => {
  const errorCode = error?.code;

  switch (errorCode) {
    case FireBaseErrors.EmailAlreadyUse:
      return "The email you've selected is already in use!";
    case FireBaseErrors.InvalidEmail:
      return "Your email is invalid!";
    case FireBaseErrors.MissingEmail:
      return "The email field is required!";
    case FireBaseErrors.WrongPassword:
      return "Your email or password is incorrect!";
    case FireBaseErrors.TooManyRequests:
      return "Stop spamming!";
    case FireBaseErrors.UserNotFound:
      return "Your email or password is incorrect!";
    default:
      return "Something went wrong. Please try again.";
  }
};
