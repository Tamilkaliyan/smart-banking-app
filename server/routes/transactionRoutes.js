import { Router } from 'express';
import mongoose from 'mongoose';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

async function assertOwnsAccount(req, accountNo) {
  const account = await Account.findOne({ accountNo });
  if (!account) throw Object.assign(new Error('Account not found.'), { status: 404 });
  if (req.user.role !== 'admin' && String(account.user) !== String(req.user._id)) {
    throw Object.assign(new Error('Not authorized to use this account.'), { status: 403 });
  }
  return account;
}

// POST /api/transactions/deposit
router.post('/deposit', requireAuth, async (req, res) => {
  try {
    const { accountNo, amount } = req.body;
    const amt = Number(amount);
    if (!amt || amt <= 0) return res.status(400).json({ message: 'Enter a valid deposit amount.' });

    const account = await assertOwnsAccount(req, accountNo);
    account.balance += amt;
    await account.save();

    const tx = await Transaction.create({
      account: account._id,
      accountNo: account.accountNo,
      type: 'Deposit',
      amount: amt,
      balanceAfter: account.balance
    });

    res.json({ balance: account.balance, transaction: tx });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Deposit failed.' });
  }
});

// POST /api/transactions/withdraw
router.post('/withdraw', requireAuth, async (req, res) => {
  try {
    const { accountNo, amount } = req.body;
    const amt = Number(amount);
    if (!amt || amt <= 0) return res.status(400).json({ message: 'Enter a valid withdrawal amount.' });

    const account = await assertOwnsAccount(req, accountNo);
    if (account.balance < amt) return res.status(400).json({ message: 'Insufficient balance.' });

    account.balance -= amt;
    await account.save();

    const tx = await Transaction.create({
      account: account._id,
      accountNo: account.accountNo,
      type: 'Withdraw',
      amount: amt,
      balanceAfter: account.balance
    });

    res.json({ balance: account.balance, transaction: tx });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Withdrawal failed.' });
  }
});

// POST /api/transactions/transfer
router.post('/transfer', requireAuth, async (req, res) => {
  const { fromAccountNo, toAccountNo, amount } = req.body;
  const amt = Number(amount);

  if (!amt || amt <= 0) return res.status(400).json({ message: 'Enter a valid transfer amount.' });
  if (fromAccountNo === toAccountNo) return res.status(400).json({ message: 'Cannot transfer to the same account.' });

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const fromAccount = await assertOwnsAccount(req, fromAccountNo);
    const toAccount = await Account.findOne({ accountNo: toAccountNo }).session(session);
    if (!toAccount) throw Object.assign(new Error('Destination account number does not exist.'), { status: 404 });
    if (fromAccount.balance < amt) throw Object.assign(new Error('Insufficient balance.'), { status: 400 });

    fromAccount.balance -= amt;
    toAccount.balance += amt;
    await fromAccount.save({ session });
    await toAccount.save({ session });

    const [outTx] = await Transaction.create(
      [{ account: fromAccount._id, accountNo: fromAccount.accountNo, type: 'Transfer-Out', amount: amt, balanceAfter: fromAccount.balance, toAccount: toAccount.accountNo }],
      { session }
    );
    await Transaction.create(
      [{ account: toAccount._id, accountNo: toAccount.accountNo, type: 'Transfer-In', amount: amt, balanceAfter: toAccount.balance, toAccount: fromAccount.accountNo }],
      { session }
    );

    await session.commitTransaction();
    res.json({ balance: fromAccount.balance, transaction: outTx });
  } catch (err) {
    await session.abortTransaction();
    res.status(err.status || 500).json({ message: err.message || 'Transfer failed.' });
  } finally {
    session.endSession();
  }
});

// GET /api/transactions/:accountNo
router.get('/:accountNo', requireAuth, async (req, res) => {
  try {
    await assertOwnsAccount(req, req.params.accountNo);
    const txs = await Transaction.find({ accountNo: req.params.accountNo }).sort({ createdAt: -1 });
    res.json(txs);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Failed to fetch transactions.' });
  }
});

export default router;
