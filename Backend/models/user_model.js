import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/v1693411111/default-user.png",
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

const User = mongoose.model("User", userSchema,"auth");
export default User;
