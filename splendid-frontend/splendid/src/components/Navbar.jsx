import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import logo from "../assets/splendid.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = false;

  return (
    <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Splendid Logo" className="h-12 w-12 object-contain" />
          <span className="text-xl font-bold text-green-600">SPLENDID</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link className="text-gray-700 hover:text-green-600 transition" to="/">Home</Link>
          <Link className="text-gray-700 hover:text-green-600 transition" to="/">Features</Link>
          <Link className="text-gray-700 hover:text-green-600 transition" to="/">About</Link>
          <Link className="text-gray-700 hover:text-green-600 transition" to="/">Contact</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated && (
            <>
              <Link to="/register" className="flex items-center gap-2 bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                <User size={18} />
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

     {/* Mobile Menu */}
<div
  className={`md:hidden overflow-hidden transition-all duration-300 ${
    menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
  }`}
>
  <div className="flex flex-col p-4 gap-2 bg-white shadow-md">
    
    {/* Links */}
    {[
      { name: "Home", path: "/" },
      { name: "Features", path: "/" },
      { name: "About", path: "/" },
      { name: "Contact", path: "/" },
    ].map((item) => (
      <Link
        key={item.name}
        to={item.path}
        onClick={() => setMenuOpen(false)}
        className="px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition"
      >
        {item.name}
      </Link>
    ))}

    {/* Auth Section */}
    {!isAuthenticated && (
      <div className="pt-3 flex flex-col gap-2">
        <Link
          to="/register"
          onClick={() => setMenuOpen(false)}
          className="px-4 py-2 rounded-lg bg-green-800 text-white text-center hover:bg-green-700 transition">
          Register
        </Link>

      </div>
    )}
  </div>
</div>
    </nav>
  );
};

export default Navbar;