import { useContext, useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { FaSignInAlt, FaUserAlt } from "react-icons/fa";
import logo2 from "../../../public/logo2.png";
import ChatIcon from "../../components/ChatIcon/ChatIcon.jsx";
import ChatList from "../../components/ChatList/ChatList.jsx";
import ChatComponent from "../../components/Chat/ChatComponent.jsx";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { isAuthenticated } = useContext(AuthContext);
  const auth = getAuth();

  const [showChatList, setShowChatList] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  async function handleLogout(e) {
    e.preventDefault();
    try {
      await signOut(auth);
      setMenuOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  function closeMenu() {
    setIsOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-green-700 via-green-500 to-teal-400 shadow-lg sticky top-0 z-30">
      <div className="max-full mx-auto px-2 md:px-6 flex items-center justify-between h-20">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo2} alt="logo" className="w-12 h-12 md:w-16 md:h-16" />
            <span className="hidden sm:block text-2xl md:text-3xl font-bold text-white tracking-wide">
              AutoCars
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-white">
          <Link to="/" className="text-lg font-medium hover:text-teal-100 transition">
            Home
          </Link>
          <Link to="/about" className="text-lg font-medium hover:text-teal-100 transition">
            About
          </Link>
          <Link to="/catalog" className="text-lg font-medium hover:text-teal-100 transition">
            Catalog
          </Link>
          <Link to="/faq" className="text-lg font-medium hover:text-teal-100 transition">
            Help
          </Link>
          <Link to="/contact" className="text-lg font-medium hover:text-teal-100 transition">
            Contact
          </Link>
          {isAuthenticated && (
            <Link
              to="/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg font-semibold shadow transition"
            >
              Add Car
            </Link>
          )}
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-4 text-white">
          {isAuthenticated && <ChatIcon onClick={() => setShowChatList((v) => !v)} />}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="flex items-center gap-1 text-lg font-medium hover:text-teal-100 transition"
            >
              <FaSignInAlt size={22} />
              Login
            </Link>
          ) : (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1 text-lg font-medium hover:text-teal-100 transition"
            >
              <FaUserAlt size={22} />
            </button>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            className="text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="md:hidden bg-white shadow-lg rounded-b-xl px-4 py-4 flex flex-col gap-2 animate-slideDown">
          <Link
            to="/"
            className="py-2 px-2 rounded hover:bg-teal-50 font-medium"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="py-2 px-2 rounded hover:bg-teal-50 font-medium"
            onClick={closeMenu}
          >
            About
          </Link>
          <Link
            to="/catalog"
            className="py-2 px-2 rounded hover:bg-teal-50 font-medium"
            onClick={closeMenu}
          >
            Catalog
          </Link>
          <Link
            to="/faq"
            className="py-2 px-2 rounded hover:bg-teal-50 font-medium"
            onClick={closeMenu}
          >
            Help
          </Link>
          <Link
            to="/contact"
            className="py-2 px-2 rounded hover:bg-teal-50 font-medium"
            onClick={closeMenu}
          >
            Contact
          </Link>
          {isAuthenticated && (
            <Link
              to="/add"
              className="py-2 px-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
              onClick={closeMenu}
            >
              Add Car
            </Link>
          )}
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="py-2 px-2 rounded hover:bg-teal-50 font-medium"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="py-2 px-2 rounded hover:bg-teal-50 font-medium"
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="py-2 px-2 rounded hover:bg-teal-50 font-medium"
                onClick={closeMenu}
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="py-2 px-2 rounded hover:bg-teal-50 font-medium text-left w-full"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      )}

      {menuOpen && isAuthenticated && (
        <div
          ref={menuRef}
          className="absolute right-6 top-20 bg-white text-black rounded-md shadow-lg p-3 flex flex-col z-20 min-w-[160px]"
        >
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="hover:bg-gray-200 p-2 rounded"
          >
            My Profile
          </Link>
          <button onClick={handleLogout} className="hover:bg-gray-200 p-2 rounded text-left w-full">
            Logout
          </button>
        </div>
      )}

      {showChatList && isAuthenticated && (
        <ChatList
          onSelectChat={(chat) => {
            setActiveChat(chat);
            setShowChatList(false);
          }}
          onClose={() => setShowChatList(false)}
          activeChatId={activeChat?.id}
        />
      )}
      {activeChat && isAuthenticated && (
        <ChatComponent
          owner={activeChat.participants.find((p) => p !== (auth.currentUser?.email || ""))}
          onClose={() => setActiveChat(null)}
        />
      )}
    </header>
  );
};

export default Header;
