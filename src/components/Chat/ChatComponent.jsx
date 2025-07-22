import React, { useState, useEffect, useRef, useContext } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FaCheck, FaCheckDouble } from "react-icons/fa6";
import { AuthContext } from "../../Context/AuthContext"; // useAuth context
import { Dot } from "lucide-react";

function timeAgo(date) {
  if (!date) return "";
  const now = new Date();
  const msgDate = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
  const diff = Math.floor((now - msgDate) / 1000);
  if (diff < 60)
    return (
      <>
        <Dot className="text-green-500 -scale-150 align-middle" /> <span>active now</span>
      </>
    );
  if (diff < 3600) return `active ${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `active ${Math.floor(diff / 3600)}h ago`;
  return `active ${msgDate.toLocaleDateString()}`;
}

export default function ChatComponent({ owner, onClose }) {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const { usersMeta } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ownerStatus, setOwnerStatus] = useState(null);

  const messagesEndRef = useRef(null);

  const chatId = user ? [user.email, owner].sort().join("_") : "";

  useEffect(() => {
    if (!chatId) return;
    const chatRef = doc(db, "chat", chatId);
    const unsub = onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        setMessages(docSnap.data().messages || []);
      } else {
        setMessages([]);
      }
    });
    return () => unsub();
  }, [chatId, db]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!owner || !usersMeta) return;
    console.log("usersMeta:", usersMeta);
    console.log("owner:", owner);
    console.log("usersMeta[owner]:", usersMeta[owner]);
    if (usersMeta[owner] && usersMeta[owner].lastActive) {
      setOwnerStatus(usersMeta[owner].lastActive);
    } else {
      setOwnerStatus(null);
    }
  }, [owner, usersMeta]);

  useEffect(() => {
    if (!owner || !usersMeta) return;
    console.log("usersMeta:", usersMeta);

    if (usersMeta[owner] && usersMeta[owner].lastActive) {
      setOwnerStatus(usersMeta[owner].lastActive);
    } else {
      setOwnerStatus(null);
    }
    const interval = setInterval(() => {
      if (usersMeta[owner] && usersMeta[owner].lastActive) {
        setOwnerStatus(usersMeta[owner].lastActive);
      } else {
        setOwnerStatus(null);
      }
      console.log("usersMeta (interval):", usersMeta);
    }, 30000);
    return () => clearInterval(interval);
  }, [owner, usersMeta]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    const chatRef = doc(db, "chat", chatId);
    const newMessage = {
      sender: user.email,
      text: input,
      timestamp: new Date(),
      read: false,
    };

    const chatDoc = await getDoc(chatRef);
    if (chatDoc.exists()) {
      await updateDoc(chatRef, {
        messages: arrayUnion(newMessage),
      });
    } else {
      await setDoc(chatRef, {
        participants: [user.email, owner],
        messages: [newMessage],
      });
    }
    setInput("");
  };

  function getStatusIcon(msg) {
    if (msg.sender !== user.email) return null;
    if (msg.read) {
      return (
        <span className="flex items-center gap-1 ml-1 text-blue-500">
          <FaCheckDouble title="Seen" /> <span className="text-xs">Seen</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 ml-1 text-gray-400">
        <FaCheck title="Delivered" /> <span className="text-xs">Delivered</span>
      </span>
    );
  }

  return (
    <div
      className="
        fixed inset-0 z-50 flex flex-col bg-white
        md:bottom-4 md:right-4 md:w-80 md:h-96 md:rounded md:shadow-lg md:inset-auto
      "
      style={{ minWidth: "0" }}
    >
      <div className="flex justify-between items-center border-b px-4 py-2  border-gray-300">
        <div>
          <span className="font-bold text-black">{owner ? `Chat with ${owner}` : "Chat"}</span>
          <div className="text-xs text-gray-500 mt-1 flex align-center items-center">
            {ownerStatus ? timeAgo(ownerStatus) : ""}
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl font-bold">
          &times;
        </button>
      </div>
      <div className="flex-1 overflow-y-auto mb-2 px-4 py-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.sender === user.email ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block px-3 py-1.5 rounded break-words max-w-[75%] md:max-w-[75%] ${
                msg.sender === user.email ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"
              }`}
            >
              {msg.text}
            </span>
            <div
              className={`text-xs text-gray-400 mt-1 flex items-center gap-1 ${
                msg.sender === user.email ? "justify-end text-right" : "justify-start text-left"
              }`}
            >
              {msg.timestamp &&
                new Date(
                  msg.timestamp.seconds ? msg.timestamp.seconds * 1000 : msg.timestamp
                ).toLocaleString()}
              {getStatusIcon(msg)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2 px-4 pb-4">
        <input
          className="flex-1 border rounded px-2 py-1 text-xl md:text-lg"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
