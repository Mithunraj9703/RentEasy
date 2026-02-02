import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';
import jwt from "jsonwebtoken";
import User from '../models/user_model.js';



export const signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    const profilePicture = req.file;

    try {
        if (!email || !name || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!role) {
            return res.status(400).json({ message: 'Choose your role to procced with the SignUp' });
        }
        const roleLower = role.toLowerCase();
        if (!["user", "owner"].includes(roleLower)) {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        //password must be of size greater than 6
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must of 6 characters" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        //email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "User already exists" })


        //for profile picture
        let profilePictureUrl;
        if (profilePicture) {
            const uploadResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ folder: "profiles" }, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    })
                    .end(profilePicture.buffer);
            });
            profilePictureUrl = uploadResponse.secure_url;
        } else {
            const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
            profilePictureUrl = `https://avatar.iran.liara.run/public/${idx}.png`;
        }

        //if the person is owner == some additional features must be asked like == phone number ,address

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profilePic: profilePictureUrl,
            role: roleLower, // conditional fields(if owner save otherwise not)
        })

        if (newUser) {
            //creating jwt token -- valid up to 7 days
            const token = jwt.sign({
                userId: newUser._id,
                email: newUser.email,
                role: newUser.role
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: "7d",
            });

            res.cookie("jwt", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true, // prevent XSS attacks,
                sameSite: "strict", // prevent CSRF attacks
                secure: process.env.NODE_ENV === "production",
            });

            //saving user to db
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "User registration failed" });
        }
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const onBoarding = async (req, res) => {
    const { name, phone, address } = req.body;
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Signup first to onboard" });
        }

        if (user.role !== "owner") {
            return res.status(403).json({ message: "Only owners can complete onboarding" });
        }
        if (!name || !phone || !address) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !name?.trim() && "name",
                    !phone?.trim() && "phone",
                    !address?.trim() && "address",
                ].filter(Boolean),
            });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                phone,
                address,
            },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            message: "Onboarding completed successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Onboarding error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });


        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        if (password != user.password) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });
        }


        //creating jwt token
        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            role: user.role,
            token,
        });
    } catch (error) {
        console.log("error in login controller:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }

}

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("error in logout controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


//not checked yet
export const checkAuth = (req, res) => {
    try {
        if (req.user) {
            //isAuthenticated is extra will be used in the fronted as you like
            res.status(200).json({ isAuthenticated: true, user: req.user });
        } else {
            res.status(200).json({ isAuthenticated: false });
        }
    } catch (error) {
        console.log("error in checkAuth controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//do it later -- 
export const updateProfile = async (req, res) => {

}
