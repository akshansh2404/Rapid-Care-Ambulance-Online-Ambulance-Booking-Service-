const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

function generateToken(user) {
  const payload = { id: user._id, role: user.role, name: user.name, email: user.email };
  const secret = process.env.JWT_SECRET || 'insecure_secret';
  const token = jwt.sign(payload, secret, { expiresIn: '7d' });
  return token;
}

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ success: false, message: 'Email already in use' });
  }
  const user = await User.create({ name, email, password, role });
  const token = generateToken(user);
  res.status(201).json({ success: true, data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  const match = await user.comparePassword(password);
  if (!match) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  const token = generateToken(user);
  res.json({ success: true, data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
});


