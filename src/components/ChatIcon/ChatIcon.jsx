import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FaComments } from "react-icons/fa";

export default function ChatIcon({ onClick }) {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "chat"), where("participants", "array-contains", user.email));
    const unsub = onSnapshot(q, (snap) => {
      let count = 0;
      snap.forEach((doc) => {
        const data = doc.data();
        count += (data.messages || []).filter(
          (msg) => msg.sender !== user.email && !msg.read
        ).length;
      });
      setUnreadCount(count);
    });
    return () => unsub();
  }, [user, db]);

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <FaComments size={28} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 text-xs font-bold">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
