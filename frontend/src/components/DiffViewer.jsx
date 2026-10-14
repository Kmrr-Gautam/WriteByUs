import React, { useState } from 'react';
import * as Diff from 'diff';
import { Columns, AlignLeft, Copy, Check, Sparkles } from 'lucide-react';

export default function DiffViewer({ originalText, humanizedText, metrics }) {
  const [diffMode, setDiffMode] = useState('split');
  const [copied, setCopied] = useState(false);

  const diffParts = Diff.diffWordsWithSpace(originalText || '', humanizedText || '');

  const handleCopy = () => {
    navigator.clipboard.writeText(humanizedText || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3.5 animate-fade-in">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:p-3 bg-zinc-900/40 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">View:</span>
          <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setDiffMode('split')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all active:scale-95 ${
                diffMode === 'split'
                  ? 'bg-zinc-800 text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setDiffMode('unified')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all active:scale-95 ${
                diffMode === 'unified'
                  ? 'bg-zinc-800 text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Unified</span>
            </button>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 transition-all shadow-sm active:scale-95"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Output'}</span>
        </button>
      </div>

      {/* Main Diff Display (Stacks on mobile, 2 columns on desktop) */}
      {diffMode === 'unified' ? (
        <div className="p-3 sm:p-4 bg-zinc-950 rounded-xl border border-zinc-800/80 font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text break-words">
          {diffParts.map((part, index) => {
            if (part.added) {
              return (
                <span key={index} className="bg-emerald-950/40 text-emerald-300 font-medium px-1 rounded">
                  {part.value}
                </span>
              );
            }
            if (part.removed) {
              return (
                <span key={index} className="bg-rose-950/40 text-rose-400/80 line-through px-1 rounded">
                  {part.value}
                </span>
              );
            }
            return <span key={index} className="text-zinc-300">{part.value}</span>;
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Left: Original Input */}
          <div className="p-3 sm:p-4 bg-zinc-950/60 rounded-xl border border-zinc-850 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-400 border-b border-zinc-800 pb-2">
              <span>Original Input</span>
              <span className="font-mono text-[11px] text-zinc-500">{(originalText || '').split(/\s+/).filter(Boolean).length} words</span>
            </div>
            <div className="font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-zinc-300 select-text max-h-[340px] sm:max-h-[460px] overflow-y-auto break-words">
              {diffParts.map((part, index) => {
                if (part.removed) {
                  return (
                    <span key={index} className="bg-rose-950/40 text-rose-400/80 line-through px-1 rounded">
                      {part.value}
                    </span>
                  );
                }
                if (!part.added) {
                  return <span key={index}>{part.value}</span>;
                }
                return null;
              })}
            </div>
          </div>

          {/* Right: Humanized Final */}
          <div className="p-3 sm:p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-emerald-400 border-b border-zinc-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" /> WriteByUs Output
              </span>
              <span className="font-mono text-[11px] text-zinc-500">{(humanizedText || '').split(/\s+/).filter(Boolean).length} words</span>
            </div>
            <div className="font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-zinc-100 select-text max-h-[340px] sm:max-h-[460px] overflow-y-auto break-words">
              {diffParts.map((part, index) => {
                if (part.added) {
                  return (
                    <span key={index} className="bg-emerald-950/40 text-emerald-300 font-medium px-1 rounded">
                      {part.value}
                    </span>
                  );
                }
                if (!part.removed) {
                  return <span key={index}>{part.value}</span>;
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
