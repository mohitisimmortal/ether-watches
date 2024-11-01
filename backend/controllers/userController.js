const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/userSchema");
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const EMAIL_PASS = process.env.EMAIL_PASS;
const saltRounds = parseInt(process.env.SALT_ROUNDS);

// user controller
exports.signupUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user with the given username or email already exists
    const existingUser = await userSchema.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      res.status(409).json({ error: "Username or email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new userSchema({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();
    const userToken = jwt.sign({ username, role }, SECRET_KEY, {
      expiresIn: "30d",
    });

    res.status(201).json({
      message: "User created successfully",
      userToken,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await userSchema.findOne({ username });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const role = user.role; // Get the role status from the user object

    const userToken = jwt.sign({ username, role }, SECRET_KEY, {
      expiresIn: "30d",
    });
    res
      .status(201)
      .json({ message: "Logged in successfully", userToken, role });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Use findByIdAndDelete to delete the user by ID
    const deletedUser = await userSchema.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const { username, email } = req.body;

    const userId = req.params.id; // Get the user's ID from the route parameters

    // Check if the user with the given ID exists
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the provided username or email already exists for other users
    const existingUser = await userSchema.findOne({
      $or: [{ username }, { email }],
    });

    // If an existing user is found and has a different ID, it means the username or email is already taken
    if (existingUser && existingUser._id.toString() !== userId) {
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }

    // Update the user's details and password if provided
    const updateFields = { username, email };

    await userSchema.findByIdAndUpdate(userId, updateFields);
    // Generate a new token with updated user information
    const updatedUser = await userSchema.findById(userId);
    const token = jwt.sign(updatedUser.toJSON(), SECRET_KEY, {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "User details updated successfully",
      token,
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    // const userId = req.user._id;
    const userId = req.params.id;

    // Fetch the user from the database
    const user = await userSchema.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the old password matches
    const passwordMatches = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate if the email exists in your database
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a unique token for password reset
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

    // Send a password reset email with the token
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "connectwithlastdev@gmail.com",
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "connectwithlastdev@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: http://localhost:5173/reset-password?token=${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send password reset email" });
      } else {
        res.status(200).json({ message: "Password reset email sent" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify and decode the token
    const decodedToken = jwt.verify(token, SECRET_KEY);

    // Check if the token is still valid
    if (!decodedToken || !decodedToken.email) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Update the user's password in the database
    const user = await userSchema.findOne({ email: decodedToken.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Set the new hashed password
    user.password = hashedPassword;
    await user.save();

    // Return a success response
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
