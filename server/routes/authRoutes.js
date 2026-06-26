import { Router } from 'express';
import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    if (password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // passwordHash is hashed automatically by the pre-save hook in User.js
    const user = await User.create({ name, email, passwordHash: password });
    const token = signToken(user);
    res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const valid = await user.comparePassword(password || '');
    if (!valid) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = signToken(user);
    res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters.' });
    }
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No account found with this email address.' });

    user.passwordHash = password; // re-hashed automatically by the pre-save hook
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Password reset failed.', error: err.message });
  }
});

export default router;
