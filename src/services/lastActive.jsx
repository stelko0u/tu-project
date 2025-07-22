import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, serverTimestamp } from "firebase/firestore";

export function registerUserActivity() {
  const auth = getAuth();
  const db = getFirestore();

  let timeoutId = null;
  let lastUpdate = 0;

  function updateLastActive() {
    const user = auth.currentUser;
    if (!user || !user.email) return;

    const now = Date.now();
    // Изпращай заявка само ако са минали поне 30 секунди
    if (now - lastUpdate < 30000) return;

    lastUpdate = now;

    const userDocRef = doc(db, `users/${user.uid}`);
    updateDoc(userDocRef, {
      lastActive: serverTimestamp(),
    }).catch((error) => {
      console.error("Failed to update lastActive:", error);
    });
  }

  function activityHandler() {
    clearTimeout(timeoutId);
    updateLastActive();
    timeoutId = setTimeout(updateLastActive, 30000); // еднократно повикване
  }

  window.addEventListener("mousemove", activityHandler);
  window.addEventListener("keydown", activityHandler);
  window.addEventListener("touchstart", activityHandler);

  // Ако искаш да спреш слушането:
  return () => {
    window.removeEventListener("mousemove", activityHandler);
    window.removeEventListener("keydown", activityHandler);
    window.removeEventListener("touchstart", activityHandler);
    clearTimeout(timeoutId);
  };
}
