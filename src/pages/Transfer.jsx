import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiGetAccounts, apiTransfer } from '../utils/api';
import { downloadReceipt } from '../utils/pdfReceipt';
import { Card, Alert, Select, Input, Button } from '../components/UI';

export default function Transfer() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState(params.get('acc') || '');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastTx, setLastTx] = useState(null);

  useEffect(() => {
    apiGetAccounts()
      .then((data) => {
        setAccounts(data);
        if (!fromAccount && data[0]) setFromAccount(data[0].accountNo);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const { balance, transaction } = await apiTransfer(fromAccount, toAccount.trim(), amount);
      setSuccess(`Transfer successful! Remaining balance: Rs. ${balance.toFixed(2)}`);
      setLastTx(transaction);
      setAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleDownloadReceipt() {
    if (!lastTx) return;
    const account = accounts.find((a) => a.accountNo === fromAccount);
    downloadReceipt({ ...lastTx, date: lastTx.createdAt }, account);
  }

  if (loading) {
    return <div className="max-w-md mx-auto px-4 py-10 text-ink-400 text-center">Loading accounts…</div>;
  }

  if (accounts.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <Alert type="info">You need an account before you can transfer. Create one from the dashboard.</Alert>
        <Button onClick={() => navigate('/create-account')}>Create Account</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <Card>
        <h1 className="text-xl font-display font-bold text-ink-800 mb-1">Transfer Money</h1>
        <p className="text-ink-400 text-sm mb-6">Send funds to another account number.</p>

        <Alert>{error}</Alert>
        <Alert type="success">{success}</Alert>

        <form onSubmit={handleSubmit}>
          <Select label="From Account" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}>
            {accounts.map((a) => (
              <option key={a.accountNo} value={a.accountNo}>
                {a.accountNo} — Rs. {a.balance.toFixed(2)}
              </option>
            ))}
          </Select>
          <Input
            label="To Account Number"
            required
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            placeholder="SB100231"
          />
          <Input
            label="Amount (Rs.)"
            type="number"
            min="1"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="200"
          />
          <Button type="submit" disabled={submitting} className="w-full mt-2">
            {submitting ? 'Processing…' : 'Transfer'}
          </Button>
        </form>

        {success && (
          <Button variant="outline" className="w-full mt-3" onClick={handleDownloadReceipt}>
            📄 Download Receipt (PDF)
          </Button>
        )}
      </Card>
    </div>
  );
}
