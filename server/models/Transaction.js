import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    accountNo: { type: String, required: true },
    type: {
      type: String,
      enum: ['Deposit', 'Withdraw', 'Transfer-Out', 'Transfer-In'],
      required: true
    },
    amount: { type: Number, required: true, min: 0.01 },
    balanceAfter: { type: Number, required: true },
    toAccount: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
