import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { apiAdminOverview, apiAdminReset } from '../utils/api';
import { Card, StatCard, Button, Alert } from '../components/UI';

function downloadJsonAsXlsx(rows, sheetName, filename) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

function downloadJsonAsCsv(rows, filename) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const [data, setData] = useState({ users: [], accounts: [], transactions: [] });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function refresh() {
    setLoading(true);
    try {
      const overview = await apiAdminOverview();
      setData(overview);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleReset() {
    if (!confirm('This will erase ALL non-admin users, accounts and transactions. Continue?')) return;
    try {
      await apiAdminReset();
      setMsg('All data has been reset.');
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDownloadWorkbook() {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.users), 'Users');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.accounts), 'Accounts');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.transactions), 'Transactions');
    XLSX.writeFile(wb, 'smart-banking-report.xlsx');
  }

  const totalBalance = data.accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-10 text-ink-400 text-center">Loading admin data…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-800">Admin Dashboard</h1>
          <p className="text-ink-400 text-sm">Live data from the MongoDB-backed banking API.</p>
        </div>
        <Button onClick={handleDownloadWorkbook}>⬇ Download Excel Report</Button>
      </div>

      <Alert>{error}</Alert>
      <Alert type="info">{msg}</Alert>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={data.users.length} accent="brand" />
        <StatCard label="Total Accounts" value={data.accounts.length} accent="amber" />
        <StatCard label="Total Bank Balance" value={`Rs. ${totalBalance.toFixed(2)}`} accent="green" />
        <StatCard label="Total Transactions" value={data.transactions.length} accent="red" />
      </div>

      <Card className="mb-8 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-ink-700">Users</h2>
          <button onClick={() => downloadJsonAsCsv(data.users, 'users.csv')} className="text-sm text-ink-700 font-semibold hover:text-gold-600 hover:underline">
            Export CSV
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-300 uppercase text-xs border-b border-ink-100">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Password</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((u) => (
              <tr key={u._id} className="border-b border-ink-50">
                <td className="py-2 pr-4">{u.name}</td>
                <td className="py-2 pr-4 text-ink-400">{u.email}</td>
                <td className="py-2 pr-4 text-ink-300 tracking-widest" title="Password is hashed (bcrypt) in MongoDB and never shown">
                  ********
                </td>
                <td className="py-2 pr-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-ink-100 text-ink-600'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-2 pr-4 text-ink-400">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="mb-8 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-ink-700">Accounts</h2>
          <button onClick={() => downloadJsonAsCsv(data.accounts, 'accounts.csv')} className="text-sm text-ink-700 font-semibold hover:text-gold-600 hover:underline">
            Export CSV
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-300 uppercase text-xs border-b border-ink-100">
              <th className="py-2 pr-4">Account No</th>
              <th className="py-2 pr-4">Holder</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.accounts.map((a) => (
              <tr key={a.accountNo} className="border-b border-ink-50">
                <td className="py-2 pr-4 font-medium font-mono-figures">{a.accountNo}</td>
                <td className="py-2 pr-4">{a.holderName}</td>
                <td className="py-2 pr-4 text-ink-400">{a.accountType}</td>
                <td className="py-2 pr-4 font-semibold text-ink-700 font-mono-figures">Rs. {Number(a.balance).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="mb-8 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-ink-700">All Transactions</h2>
          <button onClick={() => downloadJsonAsCsv(data.transactions, 'transactions.csv')} className="text-sm text-ink-700 font-semibold hover:text-gold-600 hover:underline">
            Export CSV
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-300 uppercase text-xs border-b border-ink-100">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Account</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Balance After</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map((t) => (
              <tr key={t._id} className="border-b border-ink-50">
                <td className="py-2 pr-4 text-ink-400 whitespace-nowrap">{new Date(t.createdAt).toLocaleString()}</td>
                <td className="py-2 pr-4 font-mono-figures">{t.accountNo}</td>
                <td className="py-2 pr-4">{t.type}</td>
                <td className="py-2 pr-4 font-mono-figures">Rs. {Number(t.amount).toFixed(2)}</td>
                <td className="py-2 pr-4 font-mono-figures">Rs. {Number(t.balanceAfter).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="border-rose-200">
        <h2 className="font-display font-bold text-rose-700 mb-2">Danger Zone</h2>
        <p className="text-sm text-ink-400 mb-4">Permanently erase all non-admin data from MongoDB and start fresh.</p>
        <Button variant="danger" onClick={handleReset}>Reset All Data</Button>
      </Card>
    </div>
  );
}
