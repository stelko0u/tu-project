import { createBrowserRouter, Link, Outlet } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import Register from "../pages/Register/Register.jsx";
import Login from "../pages/Login/Login.jsx";
import Header from "../components/Header/Header.jsx";
import UserGuard from "./UserGuard.jsx";
import About from "../pages/About/About.jsx";
import Catalog from "../pages/Catalog/Catalog.jsx";
import CarForm from "../pages/CarFom/CarForm.jsx";
import bg from "../../public/bg.jpg";
import Details from "../pages/Details/Details.jsx";
import EditForm from "../pages/EditForm/EditForm.jsx";
import { Protected } from "./Protected.jsx";
import { AdminGuard } from "./AdminGuard.jsx";
import OwnerGuard from "./OwnerGuard.jsx";
import Footer from "../components/Footer/Footer.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";
import Profile from "../pages/Profile/Profile.js";
import FAQ from "../pages/FAQ/faq.jsx";
import Contacts from "../pages/Contacts/Contacts.jsx";
import AdminPage from "../pages/Admin/Admin.jsx";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword.jsx";

import ChatIcon from "../components/ChatIcon/ChatIcon.jsx";
import ChatList from "../components/ChatList/ChatList.jsx";
import ChatComponent from "../components/Chat/ChatComponent.jsx";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import EmailVerificationPage from "../pages/Verify-Email/Verify-Email.jsx";
import AuthActionHandler from "../Handler/AuthActionHandler.jsx";
import ResetPassword from "../pages/ResetPassword/ResetPassword.jsx";

export const Layout = () => {
  const outletStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "calc(100vh - 100px)",
    display: "flex",
    flexDirection: "column",
  };

  const [showChatList, setShowChatList] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const auth = getAuth();

  return (
    <>
      <Header />
      <div style={outletStyle}>
        <Outlet />
        {/* Chat icon for mobile, visible everywhere */}
        {auth.currentUser && (
          <>
            <div className="fixed bottom-4 right-4 z-50 md:hidden bg-slate-500 p-5 rounded-full">
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
      <Footer />
    </>
  );
};

export const AuthLayout = () => {
  return (
    <>
      <div>
        <Link to="/" className="inline absolute m-1 bg-white rounded-full px-3 py-2 text-black font-bold">
          Go to home
        </Link>
      </div>
      <Outlet />
    </>
  );
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/catalog", element: <Catalog /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/contact", element: <Contacts /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/__/auth/action", element: <AuthActionHandler /> },
      { path: "/verify-email", element: <EmailVerificationPage /> },
      {
        path: "/add",
        element: (
          <Protected>
            <CarForm />
          </Protected>
        ),
      },
      {
        path: "/profile",
        element: (
          <Protected>
            <Profile />
          </Protected>
        ),
      },
      {
        path: "/edit/:id",
        element: (
          <OwnerGuard>
            <EditForm />
          </OwnerGuard>
        ),
      },
      {
        path: "/admin",
        element: (
          <AdminGuard>
            <AdminPage />
          </AdminGuard>
        ),
      },
      { path: "*", element: <NotFound /> },
      { path: "/details/:id", element: <Details /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);
