import React, { useState, useEffect } from 'react';
import { X, Search, BookOpen, Tag } from 'lucide-react';

export default function RulesModal({ isOpen, onClose }) {
  const [rules, setRules] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    if (isOpen && rules.length === 0) {
      fetch('/api/rules')
        .then(res => res.json())
        .then(data => {
          setRules(data.rules || []);
          setCategories(data.categories || {});
        })
        .catch(err => console.error('Failed to load rules:', err));
    }
  }, [isOpen, rules.length]);

  if (!isOpen) return null;

  const filteredRules = rules.filter(rule => {
    const matchesCategory = selectedCategory === 'ALL' || rule.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesQuery = !query ||
      rule.name.toLowerCase().includes(query) ||
      rule.section.toLowerCase().includes(query) ||
      rule.description.toLowerCase().includes(query) ||
      rule.exampleBefore.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-[95vw] sm:w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">The 26 AI Writing Tells</h3>
              <p className="text-xs text-zinc-400">WriteByUs De-slopping Directory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 sm:px-6 border-b border-zinc-800 bg-zinc-950/40 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tell name, formula, or section (e.g. delve, dashes, §1)..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-zinc-800 border-zinc-700 text-white font-medium'
                  : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All 26 Tells
            </button>
            {Object.entries(categories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                  selectedCategory === key
                    ? 'bg-zinc-800 border-zinc-700 text-white font-medium'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Tag className="w-3 h-3 text-zinc-500" />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rules List */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {filteredRules.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              No matching AI writing rules found for "{searchQuery}".
            </div>
          ) : (
            filteredRules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-850 space-y-3 hover:border-zinc-800 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-md">
                      {rule.section}
                    </span>
                    <h4 className="text-sm font-semibold text-white">{rule.name}</h4>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      rule.severity === 'strong'
                        ? 'bg-rose-950/30 text-rose-400 border-rose-900/40'
                        : rule.severity === 'moderate'
                        ? 'bg-amber-950/30 text-amber-400 border-amber-900/40'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {rule.severity}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {rule.description}
                </p>

                {/* Before / After examples */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">AI Tell Pattern</span>
                    <p className="text-rose-200/90 italic">"{rule.exampleBefore}"</p>
                  </div>
                  <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">WriteByUs Humanized</span>
                    <p className="text-emerald-200/90">"{rule.exampleAfter}"</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>WriteByUs Editorial Standard</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
