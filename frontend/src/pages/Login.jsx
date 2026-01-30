import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      alert("Login successful");
      console.log("User:", res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
    navigate("/")
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          RentEasy
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-lg font-medium transition-all"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-5">
          Don’t have an account?  
          <a href="/signup" className="text-red-500 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
