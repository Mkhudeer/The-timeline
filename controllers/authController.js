const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  return jwt.sign(
    { id: user._id, name: user.firstName },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

exports.getAuthPage = (req, res) => {
  console.log("GET /login HIT");
  return res.render("authPage", { error: "", user: req.user || null });
};

exports.register = async (req, res) => {
  console.log("POST /register HIT, body:", req.body);

  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      console.log("REGISTER VALIDATION: missing fields");
      return res.render("authPage", { error: "All fields are required", user: req.user || null });
    }

    if (password !== confirmPassword) {
      console.log("REGISTER VALIDATION: password mismatch");
      return res.render("authPage", { error: "Passwords do not match", user: req.user || null });
    }

    // optional: make password rule clear
    if (password.length < 6) {
      console.log("REGISTER VALIDATION: password too short");
      return res.render("authPage", { error: "Password must be at least 6 characters", user: req.user || null });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("REGISTER FAIL: email already exists:", email);
      return res.render("authPage", { error: "Email already used", user: req.user || null });
    }

    const user = await User.create({ firstName, lastName, email, password });
    console.log("REGISTER OK: created user id:", user._id.toString());

    const token = signToken(user);
    res.cookie("token", token, { httpOnly: true });
    console.log("REGISTER OK: cookie token set, redirecting to /");

    return res.redirect("/");
  } catch (err) {
    console.log("REGISTER ERROR >>>", err);

    // Mongo duplicate key
    if (err && err.code === 11000) {
      return res.render("authPage", { error: "Email already used", user: req.user || null });
    }

    // Mongoose validation
    if (err && err.name === "ValidationError") {
      const firstKey = Object.keys(err.errors)[0];
      return res.render("authPage", { error: err.errors[firstKey].message, user: req.user || null });
    }

    return res.render("authPage", { error: "Register failed", user: req.user || null });
  }
};

exports.login = async (req, res) => {
  console.log("POST /login HIT, body:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("authPage", { error: "Email & password required", user: req.user || null });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("LOGIN FAIL: user not found:", email);
      return res.render("authPage", { error: "Invalid credentials", user: req.user || null });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      console.log("LOGIN FAIL: wrong password for:", email);
      return res.render("authPage", { error: "Invalid credentials", user: req.user || null });
    }

    const token = signToken(user);
    res.cookie("token", token, { httpOnly: true });
    console.log("LOGIN OK: redirecting to /");

    return res.redirect("/");
  } catch (err) {
    console.log("LOGIN ERROR >>>", err);
    return res.render("authPage", { error: "Login failed", user: req.user || null });
  }
};

exports.logout = (req, res) => {
  console.log("GET /logout HIT");
  res.clearCookie("token");
  return res.redirect("/login");
};