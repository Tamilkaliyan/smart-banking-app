import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiGetAccounts, apiGetTransactions } from '../utils/api';
import { downloadReceipt, downloadHistoryReport } from '../utils/pdfReceipt';
import { Card, Select, Button, Alert } from '../components/UI';

const TYPE_BADGE = {
  Deposit: 'bg-emerald-50 text-emerald-700',
  Withdraw: 'bg-rose-50 text-rose-700',
  'Transfer-Out': 'bg-amber-50 text-amber-700',
  'Transfer-In': 'bg-blue-50 text-blue-700'
};

export default function Transactions() {
  const [params] = useSearchParams();
  const [accounts, setAccounts] = useState([]);
  const [accountNo, setAccountNo] = useState(params.get('acc') || '');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetAccounts()
      .then((data) => {
        setAccounts(data);
        if (!accountNo && data[0]) setAccountNo(data[0].accountNo);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!accountNo) return;
    apiGetTransactions(accountNo)
      .then(setTransactions)
      .catch((err) => setError(err.message));
  }, [accountNo]);

  const account = accounts.find((a) => a.accountNo === accountNo);
  const txsForPdf = transactions.map((t) => ({ ...t, date: t.createdAt }));

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-10 text-ink-400 text-center">Loading…</div>;
  }

  if (accounts.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <Card>You don't have any accounts yet. Create one from the dashboard first.</Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-800">Transaction History</h1>
          <p className="text-ink-400 text-sm">Full record of deposits, withdrawals and transfers.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => downloadHistoryReport(account, txsForPdf)}
          disabled={!transactions.length}
        >
          📄 Download Statement (PDF)
        </Button>
      </div>

      <Alert>{error}</Alert>

      <Card className="mb-6">
        <Select label="Select Account" value={accountNo} onChange={(e) => setAccountNo(e.target.value)}>
          {accounts.map((a) => (
            <option key={a.accountNo} value={a.accountNo}>
              {a.accountNo} — Rs. {a.balance.toFixed(2)}
            </option>
          ))}
        </Select>
      </Card>

      <Card className="overflow-x-auto">
        {transactions.length === 0 ? (
          <p className="text-center text-ink-300 py-8">No transactions yet for this account.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-300 uppercase text-xs border-b border-ink-100">
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Amount</th>
                <th className="py-3 pr-4">Related A/C</th>
                <th className="py-3 pr-4">Balance After</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-b border-ink-50 hover:bg-ink-50/60">
                  <td className="py-3 pr-4 whitespace-nowrap text-ink-500">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${TYPE_BADGE[t.type] || 'bg-ink-100 text-ink-600'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-semibold text-ink-700 font-mono-figures">Rs. {Number(t.amount).toFixed(2)}</td>
                  <td className="py-3 pr-4 text-ink-400">{t.toAccount || '-'}</td>
                  <td className="py-3 pr-4 text-ink-700 font-mono-figures">Rs. {Number(t.balanceAfter).toFixed(2)}</td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => downloadReceipt({ ...t, date: t.createdAt }, account)}
                      className="text-ink-700 font-semibold hover:text-gold-600 hover:underline whitespace-nowrap"
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
