import { Menu, User } from "lucide-react";
import React from 'react'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
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
        <div className="flex items-center gap-4">
        <button
  onClick={() => navigate("/login")}
  className="hidden md:block text-sm font-medium hover:underline"
>
  Login
</button>

<button
  onClick={() => navigate("/signup")}
  className="hidden md:block text-sm font-medium hover:underline"
>
  Sign up
</button>


          {/* Circular User Icon */}
          <div className="flex items-center gap-2 rounded-full border px-3 py-2 shadow-sm hover:shadow-md cursor-pointer">
            <Menu size={18} />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
              <User size={16} />
            </div>
          </div>
        </div>

      </div>
    </header>
   </>
  )
}

export default Header