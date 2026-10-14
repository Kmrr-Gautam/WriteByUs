import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, UserCheck, Settings, Download, Check, Fingerprint, ExternalLink } from 'lucide-react';

export default function Navbar({ onOpenRules, onOpenVoice, onOpenSettings, voiceSample, currentProvider, onSwitchToPlag }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#090a0f]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 border border-zinc-750 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-100" viewBox="0 0 64 64" fill="none">
              <path d="M14 20 L23 44 L32 24 L41 44 L50 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="50" cy="20" r="3" fill="#10b981" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-sm sm:text-base text-zinc-100 tracking-tight">WriteByUs</span>
              <span className="text-[10px] sm:text-[11px] font-normal text-zinc-400 hidden xs:inline sm:inline">a text humanizer</span>
              <span className="px-1.5 py-0.2 text-[8px] sm:text-[9px] font-mono uppercase bg-zinc-850 text-zinc-300 rounded border border-zinc-750 hidden md:inline">
                PWA
              </span>
            </div>
          </div>
        </div>

        {/* Center / Engine status indicator (large screens) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-zinc-400">Engine:</span>
          <span className="font-medium text-zinc-200">
            {currentProvider === 'rule-engine' ? 'WriteByUs Core (26 Tells)' : currentProvider.toUpperCase()}
          </span>
          {voiceSample && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              <Check className="w-3 h-3" /> Voice Active
            </span>
          )}
        </div>

        {/* Nav Actions (Responsive for Mobile) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Live site indicator badge */}
          <a
            href="https://writebyus.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-all"
            title="Open Live Web App"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Site</span>
          </a>

          {/* Quick Plag Check Switch */}
          {onSwitchToPlag && (
            <button
              onClick={onSwitchToPlag}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all active:scale-95"
              title="Plagiarism & AI Scan"
            >
              <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">AI & Plag</span>
            </button>
          )}

          {/* Voice Match button */}
          <button
            onClick={onOpenVoice}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-all active:scale-95 ${
              voiceSample
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
            }`}
            title="Match author writing sample"
          >
            <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Voice</span>
            {voiceSample && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
          </button>

          {/* 26 Rules Directory */}
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all active:scale-95"
            title="Browse 26 AI writing tells"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Rules</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all active:scale-95"
            title="Engine Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* PWA Install Button */}
          {deferredPrompt && !isInstalled && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 transition-all shadow-sm active:scale-95"
              title="Install WriteByUs as Progressive Web App"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">Install</span>
            </button>
          )}

          {/* Gautam Kumar's GitHub Repo Link */}
          <a
            href="https://github.com/Kmrr-Gautam/WriteByUs"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-all active:scale-95"
            title="Created by Gautam Kumar (@Kmrr-Gautam) — GitHub"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
