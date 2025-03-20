import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaWallet } from "react-icons/fa"; // Import the wallet icon
// import { useLogoutHotelMutation } from "../../../../src/redux/api/AuthAPI";
import toast from "react-hot-toast";
import { useLogoutHotelMutation } from "../../redux/api/AuthAPI";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to false
  const navigate = useNavigate(); // To navigate programmatically

  const [LogoutHotel] = useLogoutHotelMutation();

  useEffect(() => {
    // Check if the user is authenticated (token exists in localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    LogoutHotel();
    localStorage.removeItem("token");
    toast.success("Logout successfully")
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false); // Update the state to reflect logout
    navigate("/login");
  };

  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true"); // Persist login status
    setIsAuthenticated(true); // Update state to reflect login
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden lg:block p-4 sticky top-0 bg-white z-50 w-full">
        <div className="max-w-full mx-auto flex justify-between items-center px-4">
          {/* Brand/Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-15 w-40 object-contain" />
          </Link>

          {/* Navbar Links */}
          <div className="hidden lg:flex space-x-6 items-center">
            <Link className="text-black font-bold hover:text-black" to="/">
              Home
            </Link>
            <Link className="text-black font-bold hover:text-black" to="/dashboard/userdetails">
              Manage Users
            </Link>
            <Link className="text-black font-bold hover:text-black" to="/dashboard/about">
             About
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard/wallet"
                  className="flex items-center space-x-2 cursor-pointer ml-6"
                >
                  <FaWallet size={28} className="text-blue-600" />
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <img src="/Vector.svg" alt="Profile" className="h-8 w-8 rounded-full" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white rounded-3xl bg-blue-600 border-2 border-blue-600 px-8 py-1 hover:text-white transition duration-300 ml-6"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                className="text-white rounded-3xl bg-blue-600 border-2 border-blue-600 px-8 py-1 hover:bg-blue-700 hover:border-blue-700 hover:text-white transition duration-300 ml-6"
                to="/login"
                onClick={handleLogin}
              >
                Login/Register
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="p-2 shadow-lg sticky top-0 bg-white z-50 w-full lg:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-15 w-40 object-contain" />
          </Link>
          <button onClick={toggleNavbar} className="bg-white p-2 rounded focus:outline-none">
            <div className="w-6 h-1 bg-black mb-1"></div>
            <div className="w-6 h-1 bg-black mb-1"></div>
            <div className="w-6 h-1 bg-black"></div>
          </button>
        </div>
        <div
          className={`${isOpen ? "opacity-100 max-h-screen" : "opacity-0 max-h-0"
            } flex flex-col space-y-4 items-start py-4 transition-all duration-300 ease-in-out overflow-hidden`}
        >
          <Link className="text-black font-bold hover:text-black" to="/" onClick={closeNavbar}>
            HOME
          </Link>
          <Link
            className="text-black font-bold hover:text-black"
            to="/dashboard/userdetails"
            onClick={closeNavbar}
          >
            MANAGE USERS
          </Link>
            <Link className="text-black font-bold hover:text-black" to="/dashboard/about">
             About
            </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard/profile"
                className="flex items-center space-x-2 cursor-pointer"
                onClick={closeNavbar}
              >
                <img src="/Vector.svg" alt="Profile" className="h-8 w-8 rounded-full" />
              </Link>
              <Link
                to="/wallet"
                className="flex items-center space-x-2 cursor-pointer"
                onClick={closeNavbar}
              >
                <FaWallet size={24} className="text-black" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-white rounded-3xl bg-red-600 border-2 border-red-600 px-8 py-1 hover:bg-red-700 hover:border-red-700 hover:text-white transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              className="text-white rounded-3xl bg-blue-600 border-2 border-blue-600 px-5 py-1 hover:bg-blue-700 hover:border-blue-700 hover:text-white transition duration-300"
              to="/login"
              onClick={closeNavbar}
            >
              Login/Register
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
