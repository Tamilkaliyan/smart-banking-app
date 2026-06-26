import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiGetAccounts, apiDeposit } from '../utils/api';
import { downloadReceipt } from '../utils/pdfReceipt';
import { Card, Alert, Select, Input, Button } from '../components/UI';

export default function Deposit() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [accountNo, setAccountNo] = useState(params.get('acc') || '');
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
        if (!accountNo && data[0]) setAccountNo(data[0].accountNo);
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
      const { balance, transaction } = await apiDeposit(accountNo, amount);
      setSuccess(`Deposit successful! New balance: Rs. ${balance.toFixed(2)}`);
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
    const account = accounts.find((a) => a.accountNo === accountNo);
    downloadReceipt({ ...lastTx, date: lastTx.createdAt }, account);
  }

  if (loading) {
    return <div className="max-w-md mx-auto px-4 py-10 text-ink-400 text-center">Loading accounts…</div>;
  }

  if (accounts.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <Alert type="info">You need an account before you can deposit. Create one from the dashboard.</Alert>
        <Button onClick={() => navigate('/create-account')}>Create Account</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <Card>
        <h1 className="text-xl font-display font-bold text-ink-800 mb-1">Deposit Money</h1>
        <p className="text-ink-400 text-sm mb-6">Add funds to one of your accounts.</p>

        <Alert>{error}</Alert>
        <Alert type="success">{success}</Alert>

        <form onSubmit={handleSubmit}>
          <Select label="Account" value={accountNo} onChange={(e) => setAccountNo(e.target.value)}>
            {accounts.map((a) => (
              <option key={a.accountNo} value={a.accountNo}>
                {a.accountNo} — Rs. {a.balance.toFixed(2)}
              </option>
            ))}
          </Select>
          <Input
            label="Amount (Rs.)"
            type="number"
            min="1"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
          />
          <Button type="submit" variant="success" disabled={submitting} className="w-full mt-2">
            {submitting ? 'Processing…' : 'Deposit'}
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
