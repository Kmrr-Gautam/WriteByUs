import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, FileText, Sparkles, RefreshCw, Layers, Fingerprint } from 'lucide-react';
import { apiPlagCheck } from '../services/engine';

export default function PlagChecker({ text, onRunHumanize }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedSentence, setSelectedSentence] = useState(null);

  const handleScan = async () => {
    if (!text || !text.trim()) return;
    setLoading(true);
    try {
      const data = await apiPlagCheck(text);
      setResult(data);
      if (data.sentences && data.sentences.length > 0) {
        const flagged = data.sentences.find(s => s.riskScore >= 25) || data.sentences[0];
        setSelectedSentence(flagged);
      }
    } catch (e) {
      console.error('Failed to run plagiarism & AI check:', e);
      alert('Plagiarism check failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 sm:gap-2">
            <Fingerprint className="w-4 h-4 text-emerald-400 shrink-0" />
            WriteByUs Authenticity & Plagiarism Scanner
          </h3>
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
            Detects synthetic likelihood, web cliché overlaps, and mechanical cadence.
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={loading || !text || !text.trim()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Scanning Text...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" />
              <span>Run Authenticity Scan</span>
            </>
          )}
        </button>
      </div>

      {!result && !loading && (
        <div className="py-10 sm:py-14 text-center border border-dashed border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-2">
          <Fingerprint className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-600 mx-auto" />
          <h4 className="text-xs sm:text-sm font-medium text-zinc-300">Ready for Authenticity & Plagiarism Scan</h4>
          <p className="text-[11px] sm:text-xs text-zinc-500 max-w-sm mx-auto">
            Click "Run Authenticity Scan" above to analyze genuine human probability, lexical diversity, and sentence risk factors.
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Key Metrics Cards (2 cols on mobile, 4 cols on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {/* 1. Human vs AI Score */}
            <div className="p-3 sm:p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
              <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
                Human Score
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-xl sm:text-2xl font-bold font-mono ${result.humanScore >= 75 ? 'text-emerald-400' : result.humanScore >= 45 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {result.humanScore}%
                </span>
                <span className="text-[11px] text-zinc-500">({result.aiLikelihood}% AI)</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden mt-1">
                <div
                  className={`h-full ${result.humanScore >= 75 ? 'bg-emerald-500' : result.humanScore >= 45 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${result.humanScore}%` }}
                />
              </div>
            </div>

            {/* 2. Originality Index */}
            <div className="p-3 sm:p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
              <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
                Originality
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">
                  {result.originalityScore}%
                </span>
                <span className="text-[10px] sm:text-xs text-emerald-400 truncate">{result.plagRisk}</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate">
                {result.originalityScore >= 80 ? 'High originality' : 'Common phrasing'}
              </p>
            </div>

            {/* 3. Lexical Diversity */}
            <div className="p-3 sm:p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
              <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
                Vocabulary (TTR)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">
                  {result.lexicalDiversity}%
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate">
                {result.summary.uniqueWords} unique words
              </p>
            </div>

            {/* 4. Flagged Sentences */}
            <div className="p-3 sm:p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
              <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
                Flagged Lines
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-xl sm:text-2xl font-bold font-mono ${result.summary.flaggedSentences > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {result.summary.flaggedSentences}
                </span>
                <span className="text-[11px] text-zinc-500">/ {result.summary.totalSentences}</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate">
                {result.summary.flaggedSentences > 0 ? 'Review flagged items' : 'Clean variance'}
              </p>
            </div>
          </div>

          {/* Web Clichés Detected */}
          {result.flaggedCliches && result.flaggedCliches.length > 0 && (
            <div className="p-3 sm:p-4 bg-rose-950/20 rounded-xl border border-rose-900/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Common Web Clichés ({result.flaggedCliches.length}):</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {result.flaggedCliches.map((cliche, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[11px] rounded-lg bg-rose-900/30 border border-rose-800/40 text-rose-300 font-mono"
                  >
                    "{cliche}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sentence-by-Sentence Risk Heatmap (Responsive Stack on Mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Interactive Sentence Map */}
            <div className="lg:col-span-2 p-3 sm:p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2 gap-2">
                <span className="font-semibold text-zinc-200">Sentence Risk Heatmap</span>
                <div className="flex items-center gap-2.5 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Human</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> High AI</span>
                </div>
              </div>

              <div className="space-y-1.5 max-h-[300px] sm:max-h-[380px] overflow-y-auto pr-1">
                {result.sentences.map((sentence) => {
                  const isSelected = selectedSentence?.id === sentence.id;
                  const borderCol = sentence.riskScore >= 50
                    ? 'border-rose-900/50 bg-rose-950/20 hover:bg-rose-950/30 text-rose-200'
                    : sentence.riskScore >= 25
                    ? 'border-amber-900/50 bg-amber-950/20 hover:bg-amber-950/30 text-amber-200'
                    : 'border-zinc-800/60 bg-zinc-950/50 hover:bg-zinc-950 text-zinc-300';

                  return (
                    <div
                      key={sentence.id}
                      onClick={() => setSelectedSentence(sentence)}
                      className={`p-2 sm:p-2.5 rounded-lg border text-xs leading-relaxed transition-all cursor-pointer ${borderCol} ${isSelected ? 'ring-1 ring-white/30 font-medium' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono text-zinc-500">#{sentence.id}</span>
                        <span className="text-[10px] font-mono font-semibold">
                          {sentence.riskScore}% AI Risk
                        </span>
                      </div>
                      <p>{sentence.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sentence Detail Diagnostic */}
            <div className="p-3 sm:p-4 bg-zinc-900/90 rounded-xl border border-zinc-800 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block border-b border-zinc-800 pb-2">
                  Sentence Diagnostic
                </span>

                {selectedSentence ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase">Verdict</span>
                      <div className="font-semibold text-xs mt-0.5 text-zinc-100 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${selectedSentence.riskScore >= 50 ? 'bg-rose-500' : selectedSentence.riskScore >= 25 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                        {selectedSentence.verdict} ({selectedSentence.riskScore}%)
                      </div>
                    </div>

                    <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800/80 font-mono text-[11px] text-zinc-300 break-words">
                      "{selectedSentence.text}"
                    </div>

                    {selectedSentence.reasons && selectedSentence.reasons.length > 0 ? (
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-500 font-mono uppercase">Risk Factors</span>
                        <ul className="space-y-1 text-zinc-400">
                          {selectedSentence.reasons.map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px]">
                              <span className="text-amber-400 shrink-0">•</span> <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Clean human sentence.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic">Select a sentence to view breakdown.</p>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={onRunHumanize}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors shadow-sm active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Humanize This Text</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
