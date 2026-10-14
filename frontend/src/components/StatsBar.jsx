import React from 'react';
import { AlertCircle, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

export default function StatsBar({ analysisBefore, analysisAfter, metrics }) {
  if (!analysisBefore) return null;

  const densityBefore = analysisBefore.aiTellDensityScore || 0;
  const densityAfter = analysisAfter?.aiTellDensityScore || 0;
  const tellsBefore = analysisBefore.totalTells || 0;
  const tellsAfter = analysisAfter?.totalTells || 0;
  const reduction = metrics?.reductionPercentage ?? (tellsBefore > 0 ? Math.round(((tellsBefore - tellsAfter) / tellsBefore) * 100) : 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 p-2.5 sm:p-3 bg-zinc-900/40 rounded-2xl border border-zinc-800/80">
      {/* 1. AI Tell Density */}
      <div className="p-2.5 sm:p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 space-y-1">
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-400">
          <span className="flex items-center gap-1 sm:gap-1.5 truncate">
            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 shrink-0" /> AI Density
          </span>
          {analysisAfter && (
            <span className="text-[10px] sm:text-[11px] text-emerald-400 font-mono">
              -{Math.max(0, densityBefore - densityAfter)}%
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-xl font-bold font-mono text-white">
            {analysisAfter ? `${densityAfter}%` : `${densityBefore}%`}
          </span>
          {analysisAfter && (
            <span className="text-[11px] sm:text-xs text-zinc-500 line-through font-mono">
              {densityBefore}%
            </span>
          )}
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              (analysisAfter ? densityAfter : densityBefore) > 50
                ? 'bg-rose-500'
                : (analysisAfter ? densityAfter : densityBefore) > 20
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, analysisAfter ? densityAfter : densityBefore)}%` }}
          />
        </div>
      </div>

      {/* 2. Detected Tells */}
      <div className="p-2.5 sm:p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 space-y-1">
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-400">
          <span className="flex items-center gap-1 sm:gap-1.5 truncate">
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 shrink-0" /> Tells Found
          </span>
          {analysisAfter && (
            <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400">
              -{metrics?.tellsEliminated || 0}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-xl font-bold font-mono text-white">
            {analysisAfter ? tellsAfter : tellsBefore}
          </span>
          <span className="text-[11px] sm:text-xs text-zinc-400">patterns</span>
        </div>
        <div className="text-[10px] sm:text-[11px] text-zinc-500 flex items-center gap-1.5 truncate">
          <span>{analysisBefore.strongTells || 0} strong</span>
          <span>•</span>
          <span>{analysisBefore.moderateTells || 0} mod</span>
        </div>
      </div>

      {/* 3. Cadence / Burstiness */}
      <div className="p-2.5 sm:p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 space-y-1">
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-400">
          <span className="flex items-center gap-1 sm:gap-1.5 truncate">
            <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 shrink-0" /> Cadence
          </span>
          <span className="text-[9px] sm:text-[10px] text-zinc-500">Variance</span>
        </div>
        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-xl font-bold font-mono text-zinc-100">
            {analysisAfter ? `${analysisAfter.burstinessScore}/100` : `${analysisBefore.burstinessScore}/100`}
          </span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate">
          {((analysisAfter ? analysisAfter.burstinessScore : analysisBefore.burstinessScore) > 40)
            ? 'Natural human variance'
            : 'Predictable machine rhythm'}
        </p>
      </div>

      {/* 4. Elimination Rate */}
      <div className="p-2.5 sm:p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 space-y-1">
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-400">
          <span className="flex items-center gap-1 sm:gap-1.5 truncate">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" /> Status
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-zinc-400">
            {reduction >= 80 ? 'Human' : 'In Progress'}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
            {analysisAfter ? `${reduction}%` : 'Pending'}
          </span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate">
          {analysisAfter ? 'De-slopped cleanly' : 'Ready to humanize'}
        </p>
      </div>
    </div>
  );
}
