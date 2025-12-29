
import React from 'react';

export const BannerAd: React.FC = () => {
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-900 h-16 flex items-center justify-center border-t border-slate-300 dark:border-slate-800 sticky bottom-0 z-10">
      <div className="text-[10px] absolute top-1 left-2 text-slate-400 font-bold uppercase tracking-widest">Sponsored</div>
      <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Google AdMob Banner</div>
    </div>
  );
};

export const InterstitialAd: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-500">
      <div className="absolute top-4 right-4">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <span className="material-icons-round">close</span>
        </button>
      </div>
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-indigo-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
          <span className="material-icons-round text-4xl">ad_units</span>
        </div>
        <h2 className="text-2xl font-bold mb-3">Sponsored Content</h2>
        <p className="text-slate-300 mb-8 text-sm leading-relaxed">
          This ad supports the free version of MyNote. Thank you for your patience!
        </p>
        <button 
          onClick={onClose}
          className="w-full bg-white text-slate-900 font-bold py-4 px-8 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Continue to App
        </button>
        <p className="mt-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Google AdMob Interstitial</p>
      </div>
    </div>
  );
};
