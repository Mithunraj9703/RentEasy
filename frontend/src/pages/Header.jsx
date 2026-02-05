import { Menu, User } from "lucide-react";
import React from 'react'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { checkAuth } from "../api/auth";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAuth = async () => {
      const data = await checkAuth();
      setIsAuthenticated(data.isAuthenticated);
      setUser(data.user || null);
    };
    fetchAuth()
  }, [])
  return (
    <>
      <header className="w-full border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Left: Logo */}
          <div className="text-2xl font-bold text-rose-500">
            <Link to="/" >RentEasy</Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-black">Stays</a>
            <a href="#" className="hover:text-black">Experiences</a>
            <a href="#" className="hover:text-black">Online Experiences</a>
          </nav>

          {/* Right: Login / Signup */}
          <div className="flex items-center gap-3">

            {!isAuthenticated ? (
              <>
                {/* Login */}
                <button
                  onClick={() => navigate("/login")}
                  className="
          hidden md:block
          px-4 py-2
          text-sm font-medium
          rounded-full
          hover:bg-gray-100
          transition
        "
                >
                  Login
                </button>

                {/* Signup (Primary CTA) */}
                <button
                  onClick={() => navigate("/google_login")}
                  className="
          hidden md:block
          px-4 py-2
          text-sm font-medium
          rounded-full
          bg-rose-500 text-white
          hover:bg-rose-600
          transition
          shadow-sm
        "
                >
                  Sign up
                </button>
              </>
            ) : (
              /* Authenticated User Menu */
              <div
                // onClick={() => navigate("/profile")}
                className="
        flex items-center gap-3
        rounded-full
        border
        px-3 py-2
        shadow-sm
        hover:shadow-md
        hover:bg-gray-50
        transition
        cursor-pointer
      "
              >
                <Menu size={18} />

                {/* Avatar */}
                <div className="h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-semibold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>

                {/* Name (hide on small screens) */}
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </div>
            )}

          </div>


        </div>
      </header>
    </>
  )
}

export default Header