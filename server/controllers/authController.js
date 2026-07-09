const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required."
      });
    }

    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.createUser(
      username,
      email,
      passwordHash
    );

    res.status(201).json({
      message: "User registered successfully.",
      user
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({

    message: "Login successful.",

    token,

    user: {

        id: user.id,

        username: user.username,

        email: user.email,

        role: user.role,

        profile_image: user.profile_image

    }

});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

async function profile(req, res) {
  try {

    const user = await userModel.findUserById(req.user.id);

    res.json(user);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

async function updateProfile(req, res) {
  try {

    const current = await userModel.findUserById(req.user.id);

    const bio = req.body.bio !== undefined ? req.body.bio : current.bio;

    const profileImage = req.body.profile_image !== undefined
      ? req.body.profile_image
      : current.profile_image;

    const user = await userModel.updateProfile(
      req.user.id,
      bio,
      profileImage
    );

    res.json({
      message: "Profile updated successfully.",
      user
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

module.exports = {
  register,
  login,
  profile,
  updateProfile
};