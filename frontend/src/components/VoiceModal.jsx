import React, { useState, useEffect } from 'react';
import { X, UserCheck, Check, Trash2, HelpCircle } from 'lucide-react';

export default function VoiceModal({ isOpen, onClose, voiceSample, onSaveVoice }) {
  const [sampleText, setSampleText] = useState(voiceSample || '');
  const [voiceStats, setVoiceStats] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setSampleText(voiceSample || '');
  }, [voiceSample]);

  useEffect(() => {
    if (!sampleText.trim()) {
      setVoiceStats(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAnalyzing(true);
      try {
        const res = await fetch('/api/voice-sample', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sample: sampleText })
        });
        const data = await res.json();
        setVoiceStats(data);
      } catch (e) {
        console.error('Failed to analyze voice sample:', e);
      } finally {
        setIsAnalyzing(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [sampleText]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveVoice(sampleText.trim());
    onClose();
  };

  const handleClear = () => {
    setSampleText('');
    onSaveVoice('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-[95vw] sm:w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-200">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Match Author Voice Profile</h3>
              <p className="text-xs text-zinc-400">WriteByUs Personal Voice Sampling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-1">
            <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-400" /> How Voice Matching Works
            </div>
            <p className="text-zinc-400">
              Paste 2–3 paragraphs of writing you genuinely authored. WriteByUs measures your natural sentence length, dash habits, and vocabulary cadence to calibrate the humanization engine to your signature voice.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <label htmlFor="voice-sample-input" className="font-medium text-zinc-300">Your Sample Text:</label>
              <span className="font-mono text-zinc-500">{sampleText.split(/\s+/).filter(Boolean).length} words</span>
            </div>
            <textarea
              id="voice-sample-input"
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder="Paste 2-3 paragraphs of your own natural writing here..."
              rows={8}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 font-sans resize-none"
            />
          </div>

          {/* Voice analysis feedback */}
          {voiceStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
              <div className="p-2 bg-zinc-900/50 rounded-lg">
                <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Avg Sentence</span>
                <span className="text-sm font-semibold text-zinc-100 font-mono">{voiceStats.avgSentenceLength} words</span>
              </div>
              <div className="p-2 bg-zinc-900/50 rounded-lg">
                <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Dash Habit</span>
                <span className={`text-sm font-semibold ${voiceStats.usesDashes ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {voiceStats.usesDashes ? 'Uses Dashes' : 'No Dashes'}
                </span>
              </div>
              <div className="p-2 bg-zinc-900/50 rounded-lg">
                <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Tone Profile</span>
                <span className="text-sm font-semibold text-zinc-200">{voiceStats.toneEstimate}</span>
              </div>
              <div className="p-2 bg-zinc-900/50 rounded-lg">
                <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Sentences</span>
                <span className="text-sm font-semibold text-zinc-400 font-mono">{voiceStats.sentenceCount}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800">
          <button
            onClick={handleClear}
            disabled={!sampleText}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Voice Sample</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 rounded-lg transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Apply Voice Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
