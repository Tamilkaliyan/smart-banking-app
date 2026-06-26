import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiForgotPassword } from '../utils/api';
import { Card, Alert, Input, Button } from '../components/UI';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto-redirect to login a couple of seconds after a successful reset
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => navigate('/login'), 2200);
    return () => clearTimeout(timer);
  }, [success, navigate]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      await apiForgotPassword(form.email, form.password);
      setForm({ email: '', password: '', confirm: '' });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 bg-ink-50">
      <Card className="w-full max-w-md relative overflow-hidden">
        {/* decorative accent bar — the gold ledger-rule motif */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400" />

        <div className="flex items-center gap-3 mb-1">
          <span className="w-10 h-10 rounded-xl bg-ink-50 text-ink-700 flex items-center justify-center text-lg">
            🔒
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-ink-800">Reset Password</h1>
            <p className="text-ink-400 text-sm">Secure your account with a new password.</p>
          </div>
        </div>

        <div className="mt-6">
          {!success ? (
            <>
              <Alert>{error}</Alert>
              <form onSubmit={handleSubmit} autoComplete="off">
                <input type="text" name="fake-username" autoComplete="username" className="hidden" tabIndex={-1} aria-hidden="true" />
                <input type="password" name="fake-password" autoComplete="new-password" className="hidden" tabIndex={-1} aria-hidden="true" />

                <Input
                  label="Registered Email"
                  type="email"
                  name="email"
                  required
                  autoComplete="off"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  autoFocus
                />
                <Input
                  label="New Password"
                  type="password"
                  name="password"
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirm"
                  required
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                />
                <Button type="submit" className="w-full mt-2">Save New Password</Button>
              </form>

              <p className="text-sm text-slate-500 mt-6 text-center">
                Remembered your password?{' '}
                <Link to="/login" className="text-brand-600 font-semibold hover:underline">
                  Back to Login
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mb-4">
                ✓
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-1">Password Updated!</h2>
              <p className="text-slate-500 text-sm mb-6">
                Your password has been changed successfully. Redirecting you to the login page…
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Go to Login Now
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
