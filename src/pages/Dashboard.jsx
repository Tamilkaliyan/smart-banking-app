import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetAccounts } from '../utils/api';
import { Card, StatCard, Button, Alert } from '../components/UI';

export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refresh() {
    setLoading(true);
    try {
      const data = await apiGetAccounts();
      setAccounts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-800 ledger-rule">Welcome, {user.name} 👋</h1>
          <p className="text-ink-400 text-sm mt-3">Here's an overview of your banking activity.</p>
        </div>
        <Link to="/create-account">
          <Button>+ New Account</Button>
        </Link>
      </div>

      <Alert>{error}</Alert>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Accounts" value={accounts.length} accent="brand" />
        <StatCard label="Total Balance" value={`Rs. ${totalBalance.toFixed(2)}`} accent="green" />
        <StatCard label="Account Holder" value={user.name} accent="amber" />
      </div>

      {loading ? (
        <Card className="text-center py-12 text-ink-400">Loading your accounts…</Card>
      ) : accounts.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-ink-400 mb-4">You don't have any accounts yet.</p>
          <Link to="/create-account">
            <Button>Create Your First Account</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {accounts.map((acc) => (
            <Card key={acc.accountNo}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-ink-400 uppercase tracking-wide">{acc.accountType} Account</p>
                  <p className="text-lg font-display font-bold text-ink-800 font-mono-figures">{acc.accountNo}</p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium">Active</span>
              </div>
              <p className="text-3xl font-extrabold text-ink-800 mt-4 font-mono-figures">Rs. {acc.balance.toFixed(2)}</p>
              <p className="text-xs text-ink-300 mt-1">Opened {new Date(acc.createdAt).toLocaleDateString()}</p>

              <div className="grid grid-cols-3 gap-2 mt-5">
                <Link to={`/deposit?acc=${acc.accountNo}`}>
                  <Button variant="success" className="w-full !px-2 text-xs">Deposit</Button>
                </Link>
                <Link to={`/withdraw?acc=${acc.accountNo}`}>
                  <Button variant="danger" className="w-full !px-2 text-xs">Withdraw</Button>
                </Link>
                <Link to={`/transfer?acc=${acc.accountNo}`}>
                  <Button variant="outline" className="w-full !px-2 text-xs">Transfer</Button>
                </Link>
              </div>
              <Link to={`/transactions?acc=${acc.accountNo}`} className="block text-center text-sm text-ink-700 font-semibold mt-4 hover:text-gold-600">
                View Transaction History →
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
