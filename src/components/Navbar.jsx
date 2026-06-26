import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-ink-900 sticky top-0 z-30 border-b border-ink-700/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 font-display font-extrabold text-white text-base">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 text-ink-900 flex items-center justify-center text-sm font-bold">
            SB
          </span>
          <span>Smart Banking</span>
        </Link>

        <div className="flex items-center gap-2 text-sm font-medium">
          {!user && (
            <>
              <Link to="/login" className="px-3 py-2 rounded-lg text-ink-200 hover:text-white hover:bg-white/5">Login</Link>
              <Link to="/register" className="px-3 py-2 rounded-lg bg-gold-500 text-ink-900 font-semibold hover:bg-gold-400">Register</Link>
            </>
          )}

          {user && user.role === 'customer' && (
            <>
              <Link to="/dashboard" className="px-3 py-2 rounded-lg text-ink-200 hover:text-white hover:bg-white/5">Dashboard</Link>
              <Link to="/transactions" className="px-3 py-2 rounded-lg text-ink-200 hover:text-white hover:bg-white/5">History</Link>
              <span className="hidden sm:inline text-ink-600">|</span>
              <span className="hidden sm:inline text-ink-300">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="px-3 py-2 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20">Logout</button>
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              <Link to="/admin" className="px-3 py-2 rounded-lg text-ink-200 hover:text-white hover:bg-white/5">Admin Panel</Link>
              <button onClick={handleLogout} className="px-3 py-2 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
