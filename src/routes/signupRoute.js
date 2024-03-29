const express = require("express");
require("dotenv").config();
const app = express();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const router = express.Router();

// Use body-parser middleware for both JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// This should be before any routes that expect request data

const User = require("../models/user");

const uri = process.env.MONGODB_URI;

router.post("/signup", async (req, res) => {
  // Access parsed body data after middleware application
  console.log(req.body);
  const userData = req.body;
  console.log(userData)

  if (
    !userData.firstName ||
    !userData.lastName ||
    !userData.email ||
    !userData.phone ||
    !userData.password ||
    !userData.confirmPassword
  ) {
    return res.status(400).send("Please fill in all required fields.");
  }

  if (userData.password !== userData.confirmPassword) {
    return res.status(400).send("Passwords do not match.");
  }

  try {
    const password = userData.password;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const newUser = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      password: hashedPassword,
    });

    await newUser.save(); // Save the new user to the database

    res.status(201).send("Signup successful!");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred during signup. Please try again later.");
  }
});
module.exports = router;
