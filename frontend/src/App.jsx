import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Upload,
  ClipboardPaste,
  Download,
  FileText,
  Eye,
  Columns,
  ListFilter,
  Fingerprint,
  RefreshCw,
  Heart
} from 'lucide-react';

import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import DiffViewer from './components/DiffViewer';
import TellsInspector from './components/TellsInspector';
import PlagChecker from './components/PlagChecker';
import RulesModal from './components/RulesModal';
import VoiceModal from './components/VoiceModal';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [humanizedResult, setHumanizedResult] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [activeTab, setActiveTab] = useState('humanized'); // 'humanized', 'diff', 'tells', 'plag'
  const [copySuccess, setCopySuccess] = useState(false);
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState('');

  // Modals state
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // User Voice Sample (from localStorage)
  const [voiceSample, setVoiceSample] = useState(() => {
    return localStorage.getItem('writebyus_voice_sample') || '';
  });

  // Settings / Config (from localStorage)
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('writebyus_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      provider: 'rule-engine',
      apiKey: '',
      model: '',
      tone: 'natural',
      temperature: 0.4
    };
  });

  const fileInputRef = useRef(null);

  const handleSaveVoice = (sample) => {
    setVoiceSample(sample);
    localStorage.setItem('writebyus_voice_sample', sample);
  };

  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('writebyus_config', JSON.stringify(newConfig));
  };

  // Fetch presets
  useEffect(() => {
    fetch('/api/presets')
      .then(res => res.json())
      .then(data => {
        setPresets(data);
        if (data.length > 0 && !inputText) {
          setInputText(data[0].text);
          setSelectedPresetId(data[0].id);
        }
      })
      .catch(err => console.error('Failed to load presets:', err));
  }, []);

  // Real-time analysis debounce
  useEffect(() => {
    if (!inputText.trim()) {
      setAnalysis(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAnalyzing(true);
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText })
        });
        const data = await res.json();
        setAnalysis(data);
      } catch (e) {
        console.error('Analysis error:', e);
      } finally {
        setIsAnalyzing(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [inputText]);

  // Execute Humanization
  const handleHumanize = async () => {
    if (!inputText.trim()) return;

    setIsHumanizing(true);
    try {
      const res = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          provider: config.provider,
          apiKey: config.apiKey,
          model: config.model,
          voiceSample,
          tone: config.tone,
          temperature: config.temperature
        })
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      setHumanizedResult(data);
      setActiveTab('humanized');

      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#ffffff', '#a1a1aa', '#10b981', '#34d399']
      });
    } catch (e) {
      console.error('Failed to humanize:', e);
      alert('Failed to humanize: ' + e.message);
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleSelectPreset = (id) => {
    setSelectedPresetId(id);
    const found = presets.find(p => p.id === id);
    if (found) {
      setInputText(found.text);
      setHumanizedResult(null);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        setHumanizedResult(null);
      }
    } catch (e) {
      alert('Unable to access clipboard. Please paste manually.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setInputText(content);
        setHumanizedResult(null);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    const textToCopy = humanizedResult?.humanizedText || '';
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = (format = 'txt') => {
    const text = humanizedResult?.humanizedText || '';
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `writebyus-text.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = (inputText.match(/\b\w+\b/g) || []).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Responsive Navbar */}
      <Navbar
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSwitchToPlag={() => setActiveTab('plag')}
        voiceSample={voiceSample}
        currentProvider={config.provider}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Responsive Header / Presets bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 border-b border-zinc-850">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              WriteByUs
              <span className="text-xs sm:text-sm font-normal text-zinc-400 font-serif italic">— a text humanizer</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Remove mechanical AI signs, verify genuine authenticity, and restore natural human rhythm without modifying your underlying meaning.
            </p>
          </div>

          {/* Mobile swipeable Presets bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0 flex-nowrap sm:flex-wrap">
            <span className="text-zinc-500 mr-1 text-[11px] shrink-0">Presets:</span>
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-2.5 py-1 rounded-lg border transition-all text-xs shrink-0 whitespace-nowrap active:scale-95 ${
                  selectedPresetId === preset.id
                    ? 'bg-zinc-800 border-zinc-700 text-white font-medium'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {preset.title.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Stats Counter */}
        <StatsBar
          analysisBefore={analysis?.summary}
          analysisAfter={humanizedResult?.analysisAfter}
          metrics={humanizedResult?.metrics}
        />

        {/* Work Area: Responsive Grid (Stacks cleanly on Mobile, 2 Cols on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* LEFT PANE: Editor Input */}
          <div className="flex flex-col rounded-2xl bg-zinc-900/40 border border-zinc-800 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-zinc-800 bg-zinc-950/40">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Input Prose</span>
                {isAnalyzing && (
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-mono">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" /> scanning...
                  </span>
                )}
              </div>

              {/* Minimal Tools */}
              <div className="flex items-center gap-1 text-xs">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.md,.markdown"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors active:scale-95"
                  title="Upload text file"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors active:scale-95"
                  title="Paste from clipboard"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Paste</span>
                </button>
                <button
                  onClick={() => {
                    setInputText('');
                    setHumanizedResult(null);
                  }}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors active:scale-95"
                  title="Clear"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Input Textarea */}
            <div className="relative flex-1 p-3.5 sm:p-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste AI draft or text to humanize..."
                rows={12}
                className="w-full h-full min-h-[220px] sm:min-h-[340px] bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed font-sans"
              />
            </div>

            {/* Responsive Footer with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-3 border-t border-zinc-800 bg-zinc-950/60">
              <div className="flex items-center justify-between sm:justify-start gap-2.5 text-xs text-zinc-400 font-mono text-[11px]">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>~{readTimeMinutes}m read</span>
              </div>

              {/* Action buttons (stretch nicely on mobile for thumb tap) */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('plag')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 transition-all active:scale-95"
                >
                  <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Check AI Plag</span>
                </button>

                <button
                  onClick={handleHumanize}
                  disabled={isHumanizing || !inputText.trim()}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
                >
                  {isHumanizing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Humanizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Humanize Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Output, Diff & Plag Checker */}
          <div className="flex flex-col rounded-2xl bg-zinc-900/40 border border-zinc-800 overflow-hidden shadow-sm">
            {/* Header Tabs (Horizontally scrollable on mobile) */}
            <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 border-b border-zinc-800 bg-zinc-950/40 gap-2">
              <div className="flex items-center gap-1 p-0.5 bg-zinc-950 rounded-xl border border-zinc-800 text-xs overflow-x-auto scrollbar-none flex-nowrap shrink-0">
                <button
                  onClick={() => setActiveTab('humanized')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shrink-0 active:scale-95 ${
                    activeTab === 'humanized'
                      ? 'bg-zinc-800 text-white font-medium shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Humanized</span>
                </button>
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shrink-0 active:scale-95 ${
                    activeTab === 'diff'
                      ? 'bg-zinc-800 text-white font-medium shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Diff</span>
                </button>
                <button
                  onClick={() => setActiveTab('tells')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shrink-0 active:scale-95 ${
                    activeTab === 'tells'
                      ? 'bg-zinc-800 text-white font-medium shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Tells ({analysis?.tells?.length || 0})</span>
                </button>
                <button
                  onClick={() => setActiveTab('plag')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shrink-0 active:scale-95 ${
                    activeTab === 'plag'
                      ? 'bg-zinc-800 text-emerald-300 font-medium shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AI & Plag</span>
                </button>
              </div>

              {/* Actions */}
              {humanizedResult && activeTab === 'humanized' && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all shadow-sm active:scale-95"
                    title="Copy humanized text"
                  >
                    {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{copySuccess ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload('md')}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-all active:scale-95"
                    title="Download Markdown"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto max-h-[460px] sm:max-h-[520px]">
              {activeTab === 'humanized' && (
                humanizedResult ? (
                  <div className="text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap select-text animate-fade-in">
                    {humanizedResult.humanizedText}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-16 sm:py-20 text-center text-zinc-500 space-y-2">
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-600" />
                    <h4 className="text-sm font-medium text-zinc-300">Clean Editorial View</h4>
                    <p className="text-xs text-zinc-500 max-w-xs px-4">
                      Click "Humanize Text" to strip AI residue, adjust cadence, and view humanized output here.
                    </p>
                  </div>
                )
              )}

              {activeTab === 'diff' && (
                <DiffViewer
                  originalText={inputText}
                  humanizedText={humanizedResult?.humanizedText}
                  metrics={humanizedResult?.metrics}
                />
              )}

              {activeTab === 'tells' && (
                <TellsInspector
                  tells={analysis?.tells || []}
                />
              )}

              {activeTab === 'plag' && (
                <PlagChecker
                  text={inputText}
                  onRunHumanize={handleHumanize}
                />
              )}
            </div>

            {/* Output Footer */}
            {humanizedResult && (
              <div className="flex items-center justify-between px-3.5 sm:px-4 py-2 border-t border-zinc-800 bg-zinc-950/60 text-xs text-zinc-400 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-400 truncate">
                  <Check className="w-3 h-3 shrink-0" />
                  <span className="truncate">{humanizedResult.provider}</span>
                </span>
                <span className="shrink-0">
                  {(humanizedResult.humanizedText.match(/\b\w+\b/g) || []).length} words
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Minimal Footer with full credits to Gautam Kumar / Kmrr-Gautam */}
        <footer className="py-5 border-t border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-center sm:text-left">
            <span>Created by</span>
            <a
              href="https://github.com/Kmrr-Gautam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-white font-medium inline-flex items-center gap-1 transition-colors underline underline-offset-2"
            >
              Gautam Kumar (@Kmrr-Gautam)
            </a>
            <span>•</span>
            <span>WriteByUs a text humanizer</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => setIsRulesOpen(true)} className="hover:text-zinc-300 transition-colors">
              26 Tells
            </button>
            <button onClick={() => setIsVoiceOpen(true)} className="hover:text-zinc-300 transition-colors">
              Voice Match
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="hover:text-zinc-300 transition-colors">
              Settings
            </button>
            <a
              href="https://github.com/Kmrr-Gautam/WriteByUs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
      <VoiceModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        voiceSample={voiceSample}
        onSaveVoice={handleSaveVoice}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
}
