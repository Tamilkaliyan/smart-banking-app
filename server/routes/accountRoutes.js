import { Router } from 'express';
import Account from '../models/Account.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function generateAccountNo() {
  return `SB${100000 + Math.floor(Math.random() * 899999)}`;
}

// GET /api/accounts  -> all accounts belonging to the logged-in user
router.get('/', requireAuth, async (req, res) => {
  const accounts = await Account.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(accounts);
});

// GET /api/accounts/:accountNo -> single account (must belong to the user, or be admin)
router.get('/:accountNo', requireAuth, async (req, res) => {
  const account = await Account.findOne({ accountNo: req.params.accountNo });
  if (!account) return res.status(404).json({ message: 'Account not found.' });
  if (req.user.role !== 'admin' && String(account.user) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to view this account.' });
  }
  res.json(account);
});

// POST /api/accounts -> create a new account for the logged-in user
router.post('/', requireAuth, async (req, res) => {
  try {
    const { accountType = 'Savings', openingBalance = 0 } = req.body;

    let accountNo;
    let exists = true;
    while (exists) {
      accountNo = generateAccountNo();
      exists = await Account.exists({ accountNo });
    }

    const account = await Account.create({
      accountNo,
      user: req.user._id,
      holderName: req.user.name,
      accountType,
      balance: Number(openingBalance) || 0
    });
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create account.', error: err.message });
  }
});

export default router;
