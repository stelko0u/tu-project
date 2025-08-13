import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaCheck, FaCheckDouble } from "react-icons/fa6";

function timeAgo(date) {
  if (!date) return "";
  const now = new Date();
  const msgDate = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
  const diff = Math.floor((now - msgDate) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  return msgDate.toLocaleDateString();
}

export default function ChatList({ onSelectChat, onClose, activeChatId }) {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "chat"), where("participants", "array-contains", user.email));
    const unsub = onSnapshot(q, (snap) => {
      const chatArr = [];
      snap.forEach((doc) => {
        chatArr.push({ id: doc.id, ...doc.data() });
      });
      setChats(chatArr);
    });
    return () => unsub();
  }, [user, db]);

  const handleSelect = async (chat) => {
    if (!user) return;
    const chatRef = doc(db, "chat", chat.id);
    const updatedMessages = (chat.messages || []).map((msg) =>
      msg.sender !== user.email && !msg.read ? { ...msg, read: true } : msg
    );
    await updateDoc(chatRef, { messages: updatedMessages });
    onSelectChat(chat);
  };

  return (
    <div
      className="
        fixed inset-0 z-50 flex flex-col bg-white md:top-20 md:left-0 md:w-80 md:h-[calc(100vh-5rem)] md:rounded-r md:border
        md:inset-auto
      "
      style={{
        maxWidth: "100vw",
        maxHeight: "100vh",
        userSelect: "none", 
        WebkitUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      <div className="flex justify-between items-center border-b px-4 py-2">
        <span className="font-bold text-lg text-black">Chats</span>
        <button onClick={onClose} className="text-gray-700 hover:text-red-500 text-xl font-bold">
          &times;
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 && <div className="p-4 text-gray-400">No chats yet.</div>}
        {chats.map((chat) => {
          const other = chat.participants.find((p) => p !== user.email);
          const unread = (chat.messages || []).filter(
            (msg) => msg.sender !== user.email && !msg.read
          ).length;
          const lastMsg = chat.messages?.[chat.messages.length - 1];
          const isSent = lastMsg?.sender === user.email;
          const isRead = lastMsg?.read && isSent;
          return (
            <div
              key={chat.id}
              className={`flex items-center gap-2 px-4 py-3 cursor-pointer border-b text-black hover:bg-gray-100 ${
                unread > 0 ? "font-bold bg-blue-50" : "font-normal"
              } ${activeChatId === chat.id ? "bg-blue-100" : ""}`}
              onClick={() => handleSelect(chat)}
            >
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-1">
                  <span>{other}</span>
                  {isSent ? (
                    <FaArrowRight className="text-xs text-blue-500 ml-1" title="Sent" />
                  ) : (
                    <FaArrowLeft className="text-xs text-green-500 ml-1" title="Received" />
                  )}
                  {isSent &&
                    (isRead ? (
                      <FaCheckDouble className="text-xs text-blue-500 ml-1" title="Read" />
                    ) : (
                      <FaCheck className="text-xs text-gray-400 ml-1" title="Delivered" />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500 truncate max-w-[120px]">
                    {lastMsg?.text}
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {lastMsg?.timestamp && timeAgo(lastMsg.timestamp)}
                  </div>
                </div>
              </div>
              {unread > 0 && (
                <span className="bg-blue-500 text-white rounded-full px-2 text-xs font-bold">
                  {unread}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
