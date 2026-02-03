import { useState, useRef } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
function Signup() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const auth = getAuth();
  if(auth){
    console.log("Current User in Signup:", auth.currentUser?.displayName);
  }
  const [form, setForm] = useState({
    name: auth?.currentUser?.displayName || "",
    email: auth?.currentUser?.email || "",
    password: "",
    role: "user",
    phone: "",
    address: "",
  });

  const [profilePicture, setProfilePicture] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return alert("All fields are required");
    }

    if (form.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (form.role === "owner" && (!form.phone || !form.address)) {
      return alert("Phone and address required for owners");
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        profilePicture,
      };

      await signup(payload);
      alert("Signup successful");
      navigate("/login"); // ✅ ONLY CHANGE
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border">

        <h2 className="text-3xl font-semibold text-center mb-6">
          Create Account
        </h2>

        <div className="flex justify-center mb-6">
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">Add Photo</span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={form.name}
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <div className="flex gap-6">
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={form.role === "user"}
                onChange={handleChange}
              /> User
            </label>

            <label>
              <input
                type="radio"
                name="role"
                value="owner"
                checked={form.role === "owner"}
                onChange={handleChange}
              /> Owner
            </label>
          </div>

          {form.role === "owner" && (
            <>
              <input
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />

              <input
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />
            </>
          )}

          <button
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-xl text-lg"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Signup;
