import React, { useState } from 'react';
import { Lock, X, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminPinModal() {
  const { pinModalOpen, setPinModalOpen, setAdminOpen, showToast } = useStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!pinModalOpen) return null;
  const expectedPin = import.meta.env.VITE_ADMIN_PIN || '1234';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() === expectedPin) {
      setPin(''); setError(false); setPinModalOpen(false); setAdminOpen(true);
      showToast('Welcome to Owner Admin Studio');
    } else setError(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#161D1A] border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-sm"><Lock className="w-4 h-4" /> Owner Studio Access</div>
          <button onClick={() => { setPinModalOpen(false); setPin(''); setError(false); }} className="p-1.5 rounded-lg text-stone-500"><X className="w-4 h-4" /></button>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-300 mb-4">Enter the owner security PIN to edit website text, images, product availability, and daily pricing.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="password" inputMode="numeric" autoFocus value={pin} onChange={(e) => { setPin(e.target.value); setError(false); }} placeholder="Enter Admin PIN" className="w-full px-4 py-3 rounded-xl text-center text-lg font-extrabold tracking-[0.3em] border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#0F1412]" />
          {error && <p className="text-xs font-bold text-rose-600 text-center">Incorrect PIN (Default: 1234)</p>}
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 text-sm font-extrabold">Unlock Admin Studio <ArrowRight className="w-4 h-4" /></button>
        </form>
      </div>
    </div>
  );
}
