import React, { useState } from 'react';
import { X, Settings, Key, Cpu, Sliders, ShieldCheck } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, config, onSaveConfig }) {
  const [provider, setProvider] = useState(config.provider || 'rule-engine');
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [model, setModel] = useState(config.model || '');
  const [tone, setTone] = useState(config.tone || 'natural');
  const [temperature, setTemperature] = useState(config.temperature || 0.4);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      provider,
      apiKey: apiKey.trim(),
      model: model.trim(),
      tone,
      temperature: Number(temperature)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-[95vw] sm:w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Engine Configuration</h3>
              <p className="text-xs text-zinc-400">WriteByUs Intelligence Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Humanizer Engine
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setProvider('rule-engine')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'rule-engine'
                    ? 'bg-zinc-800 border-zinc-600 text-white'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> WriteByUs Core
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">Built-in 26 rules. Fast, offline, zero API keys.</p>
              </button>

              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'gemini'
                    ? 'bg-zinc-800 border-zinc-600 text-white'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-zinc-400" /> Google Gemini
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">Gemini Flash integration with WriteByUs prompt.</p>
              </button>

              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'openai'
                    ? 'bg-zinc-800 border-zinc-600 text-white'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-zinc-400" /> OpenAI GPT
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">GPT-4o mini with WriteByUs guidelines.</p>
              </button>

              <button
                type="button"
                onClick={() => setProvider('ollama')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'ollama'
                    ? 'bg-zinc-800 border-zinc-600 text-white'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-zinc-400" /> Local Ollama
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">Local Llama 3 / Mistral (localhost:11434).</p>
              </button>
            </div>
          </div>

          {/* API Key (if LLM selected) */}
          {provider !== 'rule-engine' && provider !== 'ollama' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                {provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI API Key'}
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${provider} API key...`}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                />
              </div>
              <p className="text-[11px] text-zinc-500">Stored safely on your device in browser localStorage.</p>
            </div>
          )}

          {/* Rewrite Tone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Output Tone
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'natural', label: 'Plain & Natural' },
                { id: 'conversational', label: 'Conversational' },
                { id: 'professional', label: 'Formal / Neutral' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    tone === t.id
                      ? 'bg-zinc-800 border-zinc-600 text-white font-medium'
                      : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Slider */}
          {provider !== 'rule-engine' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-zinc-300 flex items-center gap-1.5 font-medium">
                  <Sliders className="w-3.5 h-3.5 text-zinc-400" /> Temperature:
                </label>
                <span className="font-mono text-zinc-100 font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-zinc-200 bg-zinc-950"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 rounded-lg transition-colors shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
