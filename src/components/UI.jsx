export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_1px_2px_rgba(11,18,32,0.04),0_8px_24px_rgba(11,18,32,0.06)] border border-ink-100 p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Alert({ type = 'error', children }) {
  if (!children) return null;
  const styles = {
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    info: 'bg-brand-50 text-brand-700 border-brand-100'
  };
  return (
    <div className={`mb-4 px-4 py-3 rounded-xl border text-sm font-medium ${styles[type]}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, accent = 'brand' }) {
  const accents = {
    brand: 'from-ink-800 to-ink-700',
    green: 'from-emerald-600 to-emerald-700',
    red: 'from-rose-600 to-rose-700',
    amber: 'from-gold-600 to-gold-500'
  };
  return (
    <div className={`rounded-2xl p-5 text-white bg-gradient-to-br ${accents[accent]} shadow-md`}>
      <p className="text-[11px] uppercase tracking-[0.12em] opacity-70 font-semibold">{label}</p>
      <p className="text-2xl font-bold mt-1 font-mono-figures">{value}</p>
    </div>
  );
}

export function Input({ label, ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-ink-600 mb-1.5">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 transition"
      />
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-ink-600 mb-1.5">{label}</span>
      <select
        {...props}
        className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 transition bg-white"
      >
        {children}
      </select>
    </label>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-ink-800 hover:bg-ink-700 text-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
    outline: 'border border-ink-200 text-ink-700 hover:bg-ink-50',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    gold: 'bg-gold-500 hover:bg-gold-600 text-ink-900'
  };
  return (
    <button
      {...props}
      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
