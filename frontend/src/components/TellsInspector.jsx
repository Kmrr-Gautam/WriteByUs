import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function TellsInspector({ tells, onSelectTell }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  if (!tells || tells.length === 0) {
    return (
      <div className="p-8 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800 text-zinc-400 space-y-2">
        <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
        <h4 className="text-sm font-medium text-zinc-200">No Mechanical Tells Detected</h4>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          The prose is free from standard AI writing artifacts or has been humanized cleanly.
        </p>
      </div>
    );
  }

  const filteredTells = tells.filter(t => {
    if (selectedFilter === 'ALL') return true;
    return t.category === selectedFilter;
  });

  return (
    <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-zinc-400" />
          <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
            Flagged AI Markers ({tells.length})
          </h4>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-1 text-[11px]">
          {['ALL', 'A', 'B', 'C', 'D', 'E', 'F'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-2 py-0.5 rounded border transition-all ${
                selectedFilter === cat
                  ? 'bg-zinc-800 border-zinc-700 text-white font-medium'
                  : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat === 'ALL' ? 'All' : `§${cat}`}
            </button>
          ))}
        </div>
      </div>

      {/* Tells List */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {filteredTells.map((tell, idx) => (
          <div
            key={idx}
            onClick={() => onSelectTell && onSelectTell(tell)}
            className="p-3 bg-zinc-950/70 hover:bg-zinc-950 border border-zinc-850 hover:border-zinc-800 rounded-xl space-y-1.5 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                  {tell.section}
                </span>
                <span className="font-medium text-zinc-200 group-hover:text-emerald-300 transition-colors">
                  {tell.ruleName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 font-mono">
                  Line {tell.lineNumber}
                </span>
                <span
                  className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                    tell.severity === 'strong'
                      ? 'bg-rose-950/30 text-rose-400 border-rose-900/40'
                      : tell.severity === 'moderate'
                      ? 'bg-amber-950/30 text-amber-400 border-amber-900/40'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  {tell.severity}
                </span>
              </div>
            </div>

            {/* Matched snippet */}
            <div className="text-xs text-rose-300/90 font-mono bg-rose-950/20 px-2 py-1 rounded border border-rose-900/30 truncate">
              "{tell.matchText}"
            </div>

            <p className="text-[11px] text-zinc-400 leading-snug">
              {tell.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
