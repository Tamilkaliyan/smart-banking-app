import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-ink-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <span className="inline-block border border-gold-500/40 text-gold-400 text-xs font-semibold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full mb-6">
          Smart Banking App
        </span>

        <h1 className="font-display text-4xl sm:text-5xl font-extrabold leading-tight">
          Banking, kept on the record —<br />
          <span className="text-gold-400">your record.</span>
        </h1>

        <p className="text-ink-300 mt-5 max-w-xl mx-auto text-[15px]">
          Every deposit, withdrawal and transfer is written to a real,
          exportable Excel ledger you control.
        </p>

        <div className="flex justify-center gap-3 mt-9">
          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
              <Button variant="gold">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/register"><Button variant="gold">Open an Account</Button></Link>
              <Link to="/login">
                <Button variant="outline" className="!border-ink-600 !text-ink-200 hover:!bg-white/5">Login</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="bg-ink-50 text-ink-800">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="font-display text-2xl font-bold ledger-rule">What's on your statement</h2>

          <div className="grid sm:grid-cols-3 gap-6 mt-10 text-left">
            {[
              { no: 'Acct.', title: 'Multi-account ledger', desc: 'Open Savings, Current, or Salary accounts, each tracked with its own running balance and history.' },
              { no: 'Txn.', title: 'Deposits, withdrawals, transfers', desc: 'Every movement is validated against your real balance and written to the workbook instantly.' },
              { no: 'Stmt.', title: 'PDF receipts & statements', desc: 'Download a receipt after any transaction, or a full statement for an account, whenever you need it.' }
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-5 border border-ink-100 shadow-[0_1px_2px_rgba(11,18,32,0.04),0_8px_24px_rgba(11,18,32,0.05)]">
                <p className="font-mono-figures text-xs text-gold-600 font-semibold mb-2">{f.no}</p>
                <h3 className="font-display font-bold text-ink-800 mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
