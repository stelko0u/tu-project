import { useContext, useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { FaSignInAlt, FaUserAlt } from "react-icons/fa";
import logo2 from "../../../public/logo2.png";
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { isAuthenticated } = useContext(AuthContext);
  const auth = getAuth();

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
    <header className="bg-primary text-white p-1">
      <div className="flex justify-between">
        <nav className="hidden md:flex space-x-3 flex justify-between w-full">
          <Link to="/" className="text-3xl font-bold">
            <img src={logo2} alt="logo" className="w-16 h-16 scale-150 mx-5" />
          </Link>
          <span className="flex justify-between space-x-3 items-center">
            <Link to="/" className="hover:mt-0.5 text-xl">
              Home
            </Link>
            <Link to="/about" className="hover:mt-0.5 text-xl">
              About
            </Link>
            <Link to="/catalog" className="hover:mt-0.5 text-xl">
              Catalog
            </Link>
            <Link to="/faq" className="hover:mt-0.5 text-xl">
              Help
            </Link>
            <Link to="/contact" className="hover:mt-0.5 text-xl">
              Contact
            </Link>
            {isAuthenticated && (
              <Link
                to="/add"
                className=" text-xl bg-[#004D40] py-1 px-3 rounded-md hover:bg-[#0f3a34] transition duration-300"
              >
                Add car
              </Link>
            )}
          </span>
          <span className="flex justify-between space-x-5 items-center pr-2 ">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <FaSignInAlt size={24} />
                </Link>

              </>
            ) : (
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center text-xl mr-2">
                <FaUserAlt />
              </button>
            )}
          </span>
        </nav>

        <span className="md:hidden p-1 flex justify-between items-center w-screen">
          <h1 className="text-xl font-bold">AutoCars</h1>
          <button className="md:hidden p-1 " onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </span>
      </div>

      {isOpen && (
        <nav className="md:hidden p-4 flex flex-col space-y-2 items-start">
          <Link to="/" className="hover:ml-2" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/about" className="hover:ml-2" onClick={closeMenu}>
            About
          </Link>
          <Link to="/catalog" className="hover:ml-2" onClick={closeMenu}>
            Catalog
          </Link>
          <Link to="/faq" className="hover:ml-2" onClick={closeMenu}>
            Help
          </Link>
          <Link to="/contact" className="hover:ml-2" onClick={closeMenu}>
            Contact
          </Link>
          {isAuthenticated && (
            <Link to="/add" className="hover:ml-2" onClick={closeMenu}>
              Add car
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:ml-2" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="hover:ml-2" onClick={closeMenu}>
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="hover:ml-2" onClick={closeMenu}>
                My profile
              </Link>
              <button onClick={handleLogout} className="hover:ml-2">
                Logout
              </button>
            </>
          )}
        </nav>
      )}

      
      {menuOpen && isAuthenticated && (
        <div
          ref={menuRef}
          className="absolute right-4 mt-2 bg-white text-black rounded-md shadow-lg p-3 flex flex-col z-20"
        >
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="hover:bg-gray-200 p-2 rounded"
          >
            My Profile
          </Link>
          <button onClick={handleLogout} className="hover:bg-gray-200 p-2 rounded">
            Logout
          </button>
        </div>
      )}
    </header>
  );
};
