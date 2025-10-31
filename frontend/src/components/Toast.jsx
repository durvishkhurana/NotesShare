import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => onClose(toast.id), 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const color = toast.type === 'error' ? 'bg-red-600' : 'bg-green-600';

  return (
    <div className={`px-4 py-2 rounded ${color} text-white shadow`}>{toast.message}</div>
  );
}
