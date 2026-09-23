import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#1A1412] text-[#FAF7F2] rounded-xl shadow-xl text-xs font-medium border border-[#3B2F2A]">
        <CheckCircle2 className="w-4 h-4 text-[#C59A6F] shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
