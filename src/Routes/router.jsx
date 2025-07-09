import { createBrowserRouter, Link, Outlet } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import Register from "../pages/Register/Register.jsx";
import Login from "../pages/Login/Login.jsx";
import { Header } from "../components/Header/Header.jsx";
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
import ResetPassword from "../pages/ResetPassword/ResetPassword.jsx";

export const Layout = () => {
  const outletStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "calc(100vh - 100px)",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      <Header />
      <div style={outletStyle}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export const AuthLayout = () => {
  return (
    <>
      <div>
        <Link to="/" className="inline absolute m-1 bg-primary rounded-full p-1 px-2 font-bold">
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
      { path: "/reset-password", element: <ResetPassword /> },

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
