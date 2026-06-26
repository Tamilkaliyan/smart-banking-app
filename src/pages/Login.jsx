import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Alert, Input, Button } from '../components/UI';

const EMPTY_FORM = { email: '', password: '' };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Always start with a blank form — never show a previous user's
  // saved email/password, even if the browser tries to autofill it.
  useEffect(() => {
    setForm(EMPTY_FORM);
    setError('');

    // Defeat aggressive browser/password-manager autofill that ignores
    // autoComplete="off": briefly mark fields readOnly, then release
    // them once the page has settled, so nothing gets auto-populated.
    const release = setTimeout(() => {
      document.querySelectorAll('input[data-guard]').forEach((el) => el.removeAttribute('readOnly'));
    }, 200);

    return () => clearTimeout(release);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      setForm(EMPTY_FORM); // clear credentials from memory immediately after use
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 bg-ink-50">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-display font-bold text-ink-800 mb-1">Welcome back</h1>
        <p className="text-ink-400 text-sm mb-6">Login to manage your accounts.</p>

        <Alert>{error}</Alert>

        {/* autoComplete="off" + a fake hidden field is the most reliable
            cross-browser way to stop password managers from auto-filling
            saved credentials from a different user session. */}
        <form onSubmit={handleSubmit} autoComplete="off">
          <input type="text" name="fake-username" autoComplete="username" className="hidden" tabIndex={-1} aria-hidden="true" />
          <input type="password" name="fake-password" autoComplete="new-password" className="hidden" tabIndex={-1} aria-hidden="true" />

          <Input
            label="Email"
            type="email"
            name="email"
            required
            autoComplete="off"
            data-guard="true"
            readOnly
            onFocus={(e) => e.target.removeAttribute('readOnly')}
            value={form.email}
            onChange={handleChange}
            placeholder="jane@example.com"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            required
            autoComplete="new-password"
            data-guard="true"
            readOnly
            onFocus={(e) => e.target.removeAttribute('readOnly')}
            value={form.password}
            onChange={handleChange}
            placeholder="••••••"
          />
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Logging in…' : 'Login'}
          </Button>
        </form>

        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-sm text-ink-600 font-semibold hover:text-gold-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <p className="text-sm text-ink-400 mt-6 text-center">
          No account yet? <Link to="/register" className="text-ink-700 font-semibold hover:text-gold-600">Register</Link>
        </p>
        <p className="text-xs text-ink-300 mt-4 text-center">
          Admin demo login: admin@smartbank.com / admin123
        </p>
      </Card>
    </div>
  );
}
