import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    accountNo: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    holderName: { type: String, required: true },
    accountType: { type: String, enum: ['Savings', 'Current', 'Salary'], default: 'Savings' },
    balance: { type: Number, required: true, default: 0, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Account', accountSchema);
