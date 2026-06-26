import { Router } from 'express';
import User from '../models/User.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireAdmin);

// GET /api/admin/overview -> users, accounts, transactions (passwords never included)
router.get('/overview', async (req, res) => {
  const [users, accounts, transactions] = await Promise.all([
    User.find().select('-passwordHash').sort({ createdAt: -1 }),
    Account.find().sort({ createdAt: -1 }),
    Transaction.find().sort({ createdAt: -1 })
  ]);
  res.json({ users, accounts, transactions });
});

// DELETE /api/admin/reset -> wipe all data (demo/admin convenience)
router.delete('/reset', async (req, res) => {
  await Promise.all([User.deleteMany({ role: { $ne: 'admin' } }), Account.deleteMany({}), Transaction.deleteMany({})]);
  res.json({ message: 'All non-admin data has been reset.' });
});

export default router;
