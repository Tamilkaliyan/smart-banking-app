import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCreateAccount } from '../utils/api';
import { Card, Alert, Input, Select, Button } from '../components/UI';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ accountType: 'Savings', openingBalance: '0' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const acc = await apiCreateAccount({
        accountType: form.accountType,
        openingBalance: form.openingBalance
      });
      navigate(`/dashboard?created=${acc.accountNo}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <Card>
        <h1 className="text-xl font-bold text-slate-800 mb-1">Create New Account</h1>
        <p className="text-slate-500 text-sm mb-6">Open a new account under your profile.</p>

        <Alert>{error}</Alert>

        <form onSubmit={handleSubmit}>
          <Select
            label="Account Type"
            value={form.accountType}
            onChange={(e) => setForm({ ...form, accountType: e.target.value })}
          >
            <option>Savings</option>
            <option>Current</option>
            <option>Salary</option>
          </Select>
          <Input
            label="Opening Balance (Rs.)"
            type="number"
            min="0"
            step="0.01"
            value={form.openingBalance}
            onChange={(e) => setForm({ ...form, openingBalance: e.target.value })}
          />
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Creating…' : 'Create Account'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
