const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isValidEmail, isValidPassword } = require('../utils/validators');
// Register new user
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePic }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Login existing user
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePic }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}
module.exports = { register, login };
