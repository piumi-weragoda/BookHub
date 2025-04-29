import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


const router = express.Router();
const generateAuthToken = (userId) => {
  // Generate a token for the user
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};


router.post("/register", async (req, res) => {
  // Handle login logic here
  try {
    const {email,username,password,} = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    if (username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters long" });
    }
    //NOTE - check user is already exist
    //const existingUser = await User.findOne({ email }, { username });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    //get random avatar
    const profileImage = `https://api.dicebear.com/5.x/initials/svg?seed=${username}`;

    const user = new User({
      email,
      username,
      password,
      profileImage,
    });

    await user.save();
    const token = generateAuthToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        //NOTE - _id uderscore is automatically added by mongoose
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const {email,password} = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //NOTE - check user is already exist

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //check password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //generate token
    const token = generateAuthToken(user._id);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        //NOTE - _id uderscore is automatically added by mongoose
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});





export default router;
//NOTE - Router, which is like a mini version of your app