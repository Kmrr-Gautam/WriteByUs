import { analyzeText } from '../core/analyzer.js';
import { humanizeText } from '../core/humanizer.js';
import { checkPlagiarismAndAI } from '../core/plagiarism.js';
import { HUMANIZER_RULES, RULE_CATEGORIES } from '../core/rules.js';

export const PRESETS = [
  {
    id: 'corporate-launch',
    title: 'Product Feature Launch',
    text: `I'm thrilled to announce that shared drafts are finally here! 🚀 For months, our own team was drowning in files named final_v7.docx — and we knew there had to be a better way. Now two people can edit the same doc at once, with every change appearing live for both of them. It's not just a feature; it's a whole new way to collaborate. Comments stay anchored to the exact sentence they reference, even as the text around them evolves. And the best part? It's available today on every plan, completely free. Let that sink in.`
  },
  {
    id: 'tech-explainer',
    title: 'Technical Architecture & Caching',
    text: `Let's dive into how modern caching works in distributed systems. Here's what you need to know: caching plays a pivotal role in today's rapidly evolving digital landscape. At its core, what really matters is request memoization and data persistence. Furthermore, it's not merely a tool for speed, it's a testament to architectural excellence. Innovation, inspiration, and efficiency come together to deliver a seamless experience — without requiring extensive configuration. The future looks bright for distributed architectures.`
  },
  {
    id: 'encyclopedia-history',
    title: 'Historical & Regional Article',
    text: `Nestled within the breathtaking region of Gonder, Alamata stands as a vibrant town boasting a rich cultural heritage. The institute was established in 1989, marking a crucial moment in regional administration, highlighting the government's commitment to modernization and symbolizing community resilience. Experts believe this represents a vital milestone for the province.`
  },
  {
    id: 'workplace-reply',
    title: 'Workplace Pull Request Reply',
    text: `Great question! To be clear, this isn't mainly about prompt length, and I'm not arguing that documentation doesn't matter. As you already know, session tokens are rotated every 24 hours. A tempting approach would be to rotate them on a cron job, but that would drop active sessions. Honestly? The real win is keeping rotation in place. I hope this helps! Let me know if you'd like me to expand on anything.`
  }
];

export async function apiAnalyze(text) {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fall back to client engine
  }
  return analyzeText(text);
}

export async function apiHumanize(text, options = {}) {
  try {
    const res = await fetch('/api/humanize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, ...options })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fall back to client engine
  }
  return await humanizeText(text, options);
}

export async function apiPlagCheck(text) {
  try {
    const res = await fetch('/api/plag-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fall back to client engine
  }
  return checkPlagiarismAndAI(text);
}

export async function apiGetPresets() {
  try {
    const res = await fetch('/api/presets');
    if (res.ok) return await res.json();
  } catch (e) {
    // Fall back to client presets
  }
  return PRESETS;
}

export async function apiGetRules() {
  try {
    const res = await fetch('/api/rules');
    if (res.ok) return await res.json();
  } catch (e) {
    // Fall back to client rules
  }
  return {
    categories: RULE_CATEGORIES,
    rules: HUMANIZER_RULES.map(r => ({
      id: r.id,
      section: r.section,
      category: r.category,
      name: r.name,
      severity: r.severity,
      description: r.description,
      exampleBefore: r.exampleBefore,
      exampleAfter: r.exampleAfter
    }))
  };
}

export async function apiAnalyzeVoice(sample) {
  try {
    const res = await fetch('/api/voice-sample', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sample })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fall back to client analysis
  }
  const words = (sample.match(/\b\w+\b/g) || []).length;
  const sentences = sample.match(/[^.!?]+[.!?]+(\s+|$)/g) || [sample];
  const usesDashes = /—|–|--/.test(sample);
  const avgSentenceLength = Math.round(words / Math.max(1, sentences.length));

  return {
    wordCount: words,
    sentenceCount: sentences.length,
    avgSentenceLength,
    usesDashes,
    dashRecommendation: usesDashes ? 'Preserve dashes at author rate' : 'Strictly strip em dashes',
    toneEstimate: sample.includes('I ') || sample.includes('my ') ? 'Personal / First-person' : 'Neutral / Third-person'
  };
}
