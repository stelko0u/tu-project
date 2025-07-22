import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ChatIcon from "./components/ChatIcon/ChatIcon";
import ChatList from "./components/ChatList/ChatList";
import ChatComponent from "./components/Chat/ChatComponent";
import { getAuth } from "firebase/auth";

export default function Layout() {
  const [showChatList, setShowChatList] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const auth = getAuth();

  return (
    <div className="relative min-h-screen">
      <Outlet />
      {auth.currentUser && (
        <>
          <div className="fixed bottom-4 right-4 z-50 md:hidden">
            <ChatIcon onClick={() => setShowChatList(true)} />
          </div>
          {showChatList && !activeChat && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end items-end">
              <ChatList
                onSelectChat={(chat) => {
                  setActiveChat(chat);
                  setShowChatList(false);
                }}
                onClose={() => setShowChatList(false)}
                activeChatId={activeChat?.id}
              />
            </div>
          )}
          {activeChat && (
            <div className="fixed inset-0 bg-white z-50 flex flex-col">
              <ChatComponent
                owner={activeChat.participants.find((p) => p !== (auth.currentUser?.email || ""))}
                onClose={() => setActiveChat(null)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
