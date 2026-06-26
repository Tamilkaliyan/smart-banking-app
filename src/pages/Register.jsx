import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Alert, Input, Button } from '../components/UI';

const EMPTY_FORM = { name: '', email: '', password: '', confirm: '' };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(EMPTY_FORM);
    setError('');
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

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      setForm(EMPTY_FORM); // clear credentials from memory immediately after use
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 bg-ink-50">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-display font-bold text-ink-800 mb-1">Create your account</h1>
        <p className="text-ink-400 text-sm mb-6">Join Smart Banking UI in seconds.</p>

        <Alert>{error}</Alert>

        <form onSubmit={handleSubmit} autoComplete="off">
          <input type="text" name="fake-username" autoComplete="username" className="hidden" tabIndex={-1} aria-hidden="true" />
          <input type="password" name="fake-password" autoComplete="new-password" className="hidden" tabIndex={-1} aria-hidden="true" />

          <Input
            label="Full Name"
            name="name"
            required
            autoComplete="off"
            data-guard="true"
            readOnly
            onFocus={(e) => e.target.removeAttribute('readOnly')}
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
          />
          <Input
            label="Email"
            name="email"
            type="email"
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
            name="password"
            type="password"
            required
            autoComplete="new-password"
            data-guard="true"
            readOnly
            onFocus={(e) => e.target.removeAttribute('readOnly')}
            value={form.password}
            onChange={handleChange}
            placeholder="••••••"
          />
          <Input
            label="Confirm Password"
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
            data-guard="true"
            readOnly
            onFocus={(e) => e.target.removeAttribute('readOnly')}
            value={form.confirm}
            onChange={handleChange}
            placeholder="••••••"
          />
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Creating account…' : 'Register'}
          </Button>
        </form>

        <p className="text-sm text-ink-400 mt-6 text-center">
          Already have an account? <Link to="/login" className="text-ink-700 font-semibold hover:text-gold-600">Login</Link>
        </p>
      </Card>
    </div>
  );
}
