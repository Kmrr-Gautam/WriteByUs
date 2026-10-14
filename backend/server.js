import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeText } from './analyzer.js';
import { humanizeText } from './humanizer.js';
import { checkPlagiarismAndAI } from './plagiarism.js';
import { HUMANIZER_RULES, RULE_CATEGORIES } from './rules.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    name: 'WriteByUs — a text humanizer & authenticity engine',
    rulesCount: HUMANIZER_RULES.length
  });
});

// Get all rules and categories
app.get('/api/rules', (req, res) => {
  res.json({
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
  });
});

// Preset sample texts demonstrating AI tells and clichés
app.get('/api/presets', (req, res) => {
  res.json([
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
  ]);
});

// Analyze text endpoint (AI tells detection)
app.post('/api/analyze', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text string is required' });
  }

  const analysis = analyzeText(text);
  res.json(analysis);
});

// Plagiarism & Genuine AI Authenticity Check endpoint
app.post('/api/plag-check', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text string is required' });
  }

  const result = checkPlagiarismAndAI(text);
  res.json(result);
});

// Humanize text endpoint
app.post('/api/humanize', async (req, res) => {
  const { text, provider, apiKey, model, voiceSample, tone, temperature } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text string is required' });
  }

  try {
    const result = await humanizeText(text, {
      provider: provider || 'rule-engine',
      apiKey,
      model,
      voiceSample,
      tone,
      temperature
    });

    res.json(result);
  } catch (error) {
    console.error('Humanize error:', error);
    res.status(500).json({ error: 'Failed to humanize text: ' + error.message });
  }
});

// Voice sample analyzer endpoint
app.post('/api/voice-sample', (req, res) => {
  const { sample } = req.body;
  if (!sample || typeof sample !== 'string') {
    return res.status(400).json({ error: 'Sample text is required' });
  }

  const words = (sample.match(/\b\w+\b/g) || []).length;
  const sentences = sample.match(/[^.!?]+[.!?]+(\s+|$)/g) || [sample];
  const usesDashes = /—|–|--/.test(sample);
  const avgSentenceLength = Math.round(words / Math.max(1, sentences.length));

  res.json({
    wordCount: words,
    sentenceCount: sentences.length,
    avgSentenceLength,
    usesDashes,
    dashRecommendation: usesDashes ? 'Preserve dashes at author rate' : 'Strictly strip em dashes',
    toneEstimate: sample.includes('I ') || sample.includes('my ') ? 'Personal / First-person' : 'Neutral / Third-person'
  });
});

app.listen(PORT, () => {
  console.log(`WriteByUs Backend running at http://localhost:${PORT}`);
});
