const express = require("express");
const { validateSignupData, validateLoginData } = require("../utils/validate");
const User = require("../models/userModel");


const signupController = async (req, res) => {
  // Validate request data
  const { error } = validateSignupData(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message),
    });
  }

  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user (password will be hashed by the pre-save middleware)
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const loginController = async (req, res) => {
  // Validate request data
  const { error } = validateLoginData(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message),
    });
  }

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      // using methods function of mongoose to set Token
      const token = await user.getJWT();
      //setting cookies
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      }); // coookie expires in 8 hrs;
    }

    // Send response
    res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const logoutController = async (req, res) => {
  try {
    // Clear any session data or tokens here
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { signupController, loginController, logoutController };
