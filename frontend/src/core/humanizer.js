import { analyzeText } from './analyzer.js';

export const HUMANIZER_SYSTEM_PROMPT = `
You are the Humanizer agent skill, based on Wikipedia's "Signs of AI writing" guide.
Your purpose: Rewrite AI-sounding text so it reads like a human writer, without changing what it says. Keep all claims, facts, numbers, dates, quotes, and citations. Do not make anything up.

Follow the 26 Humanizer Rules:
1. Not X but Y (§1): State points directly. Don't frame points with "It's not just X, it's Y" or "X rather than Y".
2. One-line closers (§2): Cut dramatic send-offs ("Let that sink in.", "That is the real win.", "The message was clear:").
3. Sayings that sound deep (§3): Remove "at its core", "the real question is", "what really matters", "X is the Y of Z". State specific claims.
4. Staged run-up (§4): Cut "Let's dive in", "Here's what you need to know", "Honestly?", "Let's be honest".
5. Arguing with no one (§5): Cut "This isn't mainly about", "I'm not saying", "Don't get me wrong", fake rejections.
6. Forced triads (§6): Don't mechanically group ideas into threes ("innovation, inspiration, and insights").
7. Repeated sentence openings (§7): Vary subjects and openings.
8. Dashes (§8): The rewrite MUST NOT contain em dashes (—) or en dashes (–) or double hyphens (--) unless the writer's sample uses them. Replace with commas, periods, or restructure.
9. Stacked qualifiers (§9): Remove excessive hedges ("could potentially possibly be argued").
10. Hyphenated pairs (§10): Drop hyphens in predicate adjectives ("the report is high quality", not "high-quality").
11. Passive voice (§11): Prefer active voice with clear actors.
12. Overused AI words (§12): Ban or replace: delve, tapestry, vibrant, crucial, testament, pivotal, intricate, interplay, landscape, deep dive, meticulous, bolstered, align with, garner, enduring, robust, showcase, underscore, quietly.
13. Inflated significance (§13): Cut "stands as a testament", "pivotal moment", "enduring legacy", "the future looks bright", "exciting times ahead".
14. Vague connection (§14): Name concrete relationships instead of "associated with", "linked to".
15. Shallow -ing riders (§15): Cut or rephrase trailing "-ing" riders (", highlighting...", ", symbolizing...", ", showcasing...").
16. Sales language (§16): Remove "nestled", "in the heart of", "breathtaking", "stunning natural beauty", "rich cultural heritage".
17. Borrowed authority (§17): Remove unnamed "experts argue", "industry reports suggest".
18. Avoiding is, are, and has (§18): Use "is", "are", and "has" instead of "serves as", "stands as", "functions as", "boasts".
19. Bold decoration (§19): Remove mechanical bold labels in lists.
20. Decorative headings (§20): Remove emojis and title-cased headings.
21. Straight quotes (§21): Use standard straight quotes.
22. Chatbot residue (§22): Cut "Great question!", "I hope this helps!", "Let me know if...", etc.
23. Knowledge-limit disclaimers (§23): Cut "as of my training update", "while details are limited".
24. Repeated headings (§24): Don't echo the heading in the opening sentence.
25. Meta-narration (§25): Don't describe how the document was compiled or what it replaces.
26. Re-explaining (§26): In replies, deliver the decision directly.

CRITICAL INSTRUCTION:
Return ONLY the humanized rewrite text, unless voice matching or explanation is specifically requested. Ensure sentence lengths alternate naturally (burstiness). Do not lose any facts.
`;

/**
 * Built-in Rule-Based Humanizer Engine
 * Executes deterministic multi-pass de-slopping transforms.
 */
export function humanizeWithRuleEngine(text, options = {}) {
  const { voiceSample = '', tone = 'natural' } = options;
  let result = text;

  // Check if voice sample allows em dashes
  const allowDashes = /—|–|--/.test(voiceSample);

  // Pass 1: Cut chatbot residue
  result = result.replace(/^(Great question[!.]*|Certainly[!.]*|Of course[!.]*|Sure thing[!.]*|You're absolutely right[!.]*)\s*/gim, '');
  result = result.replace(/\b(I hope this helps[!.]*|Let me know if you('d|\s+would) like (me to )?[^.!\n]+[.!]?|Should I continue\?|Would you like me to expand on this\?)\b/gi, '');
  result = result.replace(/^Here (is|are) (an overview|a breakdown|the details)[^:\n]*:\s*/gim, '');

  // Pass 2: Staged run-ups
  result = result.replace(/\b(Let'?s dive in(to)?|Let'?s explore|Let'?s break this down|Here'?s what you need to know|Now let'?s look at|Without further ado|Here'?s the thing|The thing is|Let'?s be honest|Real talk[:;,]?)\s*/gi, '');
  result = result.replace(/\bHonestly\?\s*/gi, '');

  // Pass 3: One-line closers and dramatic fragments
  result = result.replace(/\n+\s*(Let that sink in|Read that again|That is the real win|That distinction matters|The message was clear)[.!]*\s*(\n+|$)/gi, '\n\n');
  result = result.replace(/\b(Let that sink in|Read that again)[.!]*\s*/gi, '');

  // Pass 4: Not X but Y constructions
  // "It's not just about the beat; it's part of the atmosphere" -> "The beat is part of the atmosphere"
  result = result.replace(/It'?s\s+(not\s+just|not\s+only|not\s+merely)\s+about\s+([^,;.]+)[,;]\s*(it'?s\s+|it\s+is\s+)?(part\s+of\s+[^,;.]+)/gi, '$4');
  result = result.replace(/It'?s\s+(not\s+just|not\s+only|not\s+merely)\s+a\s+([^,;.]+)[,;]\s*(it'?s\s+|it\s+is\s+)?a\s+([^,;.]+)/gi, '$4');
  result = result.replace(/\b(it'?s\s+not\s+merely\s+a\s+song,\s*it'?s\s+a\s+statement)\b/gi, 'The song makes a direct statement');
  result = result.replace(/,\s*no guessing\b/gi, ' without requiring guesswork');

  // Pass 5: Sayings that sound deep
  result = result.replace(/\bAt its core,\s*/gi, '');
  result = result.replace(/\bThe real question is\b/gi, 'The question is');
  result = result.replace(/\bWhat really matters is\b/gi, 'The main factor is');
  result = result.replace(/\bThe heart of the matter is\b/gi, 'The issue is');

  // Pass 6: Arguing with no one
  result = result.replace(/\b(To be clear|Don'?t get me wrong)[,;]?\s*/gi, '');
  result = result.replace(/\bThis isn'?t (mainly )?about [^,.]+, (and )?/gi, '');

  // Pass 7: Dashes (em dash, en dash, double hyphen)
  if (!allowDashes) {
    result = result.replace(/\s*—\s*/g, ', ');
    result = result.replace(/\s*–\s*/g, ', ');
    result = result.replace(/\s+--\s+/g, ', ');
  }

  // Pass 8: Overused AI vocabulary substitutions
  const vocabReplacements = [
    [/\bdelve into\b/gi, 'examine'],
    [/\bdelves into\b/gi, 'examines'],
    [/\bdelving into\b/gi, 'examining'],
    [/\bdelve\b/gi, 'look'],
    [/\ba rich tapestry of\b/gi, 'a blend of'],
    [/\btapestry\b/gi, 'mix'],
    [/\bstands as a testament to\b/gi, 'reflects'],
    [/\ba testament to\b/gi, 'evidence of'],
    [/\btestament\b/gi, 'proof'],
    [/\bvibrant\b/gi, 'lively'],
    [/\bpivotal moment\b/gi, 'turning point'],
    [/\bpivotal role\b/gi, 'key role'],
    [/\bpivotal\b/gi, 'key'],
    [/\bcrucial role\b/gi, 'major role'],
    [/\bcrucial\b/gi, 'important'],
    [/\bintricate\b/gi, 'detailed'],
    [/\bintricacies\b/gi, 'details'],
    [/\bcomplex interplay\b/gi, 'interaction'],
    [/\binterplay\b/gi, 'connection'],
    [/\bevolving landscape of\b/gi, 'state of'],
    [/\blandscape of\b/gi, 'field of'],
    [/\blandscape\b/gi, 'area'],
    [/\bdeep dive\b/gi, 'close look'],
    [/\bmeticulously\b/gi, 'carefully'],
    [/\bmeticulous\b/gi, 'careful'],
    [/\bbolstered by\b/gi, 'supported by'],
    [/\bbolstered\b/gi, 'strengthened'],
    [/\balign with\b/gi, 'match'],
    [/\bgarnered\b/gi, 'received'],
    [/\bgarner\b/gi, 'earn'],
    [/\benduring legacy\b/gi, 'lasting influence'],
    [/\benduring\b/gi, 'lasting'],
    [/\brobust\b/gi, 'reliable'],
    [/\bshowcases\b/gi, 'shows'],
    [/\bshowcased\b/gi, 'showed'],
    [/\bshowcase\b/gi, 'show'],
    [/\bshowcasing\b/gi, 'showing'],
    [/\bunderscores the importance of\b/gi, 'highlights'],
    [/\bunderscores\b/gi, 'emphasizes'],
    [/\bunderscored\b/gi, 'emphasized'],
    [/\bquietly\b/gi, '']
  ];

  for (const [pattern, replacement] of vocabReplacements) {
    result = result.replace(pattern, replacement);
  }

  // Pass 9: Inflated significance & send-offs
  result = result.replace(/\s*The future looks bright\.[^.\n]*/gi, '');
  result = result.replace(/\s*Exciting times (lie )?ahead\.[^.\n]*/gi, '');
  result = result.replace(/\s*A step in the right direction\.[^.\n]*/gi, '');
  result = result.replace(/\bmarking a pivotal moment in\b/gi, 'during');
  result = result.replace(/\bmarking a crucial moment in\b/gi, 'during');
  result = result.replace(/\bcontinues to thrive\b/gi, 'continues');

  // Pass 10: Shallow -ing riders
  result = result.replace(/,\s*highlighting\s+[^,.]+/gi, '');
  result = result.replace(/,\s*underscoring\s+[^,.]+/gi, '');
  result = result.replace(/,\s*symbolizing\s+[^,.]+/gi, '');
  result = result.replace(/,\s*reflecting\s+[^,.]+/gi, '');

  // Pass 11: Sales / brochure language
  result = result.replace(/\bnestled (in|within) the breathtaking region of\b/gi, 'in');
  result = result.replace(/\bnestled (in|within)\b/gi, 'in');
  result = result.replace(/\bin the heart of\b/gi, 'in');
  result = result.replace(/\bbreathtaking\b/gi, 'scenic');
  result = result.replace(/\bmust-visit\b/gi, 'notable');
  result = result.replace(/\bstunning natural beauty\b/gi, 'scenic landscape');
  result = result.replace(/\brich cultural heritage\b/gi, 'long history');
  result = result.replace(/\bgroundbreaking\b/gi, 'new');

  // Pass 12: Verb avoidance
  result = result.replace(/\bserves as an?\b/gi, 'is a');
  result = result.replace(/\bserves as\b/gi, 'is');
  result = result.replace(/\bstands as an?\b/gi, 'is a');
  result = result.replace(/\bstands as\b/gi, 'is');
  result = result.replace(/\bfunctions as\b/gi, 'acts as');
  result = result.replace(/\bboasts (an?|over|more than)\b/gi, 'has $1');

  // Pass 13: Formatting rules (bold decoration & emojis)
  result = result.replace(/^[-*]\s+\*\*([^*]+)\*\*:\s+/gm, '- $1: ');
  result = result.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  // Pass 14: Curly quotes
  result = result.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

  // Pass 15: Clean double commas and redundant spacing
  result = result.replace(/,\s*,/g, ',');
  result = result.replace(/[ \t]{2,}/g, ' ');
  result = result.replace(/\n{3,}/g, '\n\n');
  result = result.replace(/^[\s.,;:!?-]+/, '');
  // Capitalize first letter of sentences
  result = result.replace(/(^|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());

  return result.trim();
}

/**
 * Executes Humanizer with optional LLM provider (OpenAI, Gemini, Anthropic, Groq, Ollama)
 * or falls back seamlessly to the built-in Humanizer Rule Engine.
 */
export async function humanizeText(text, options = {}) {
  const {
    provider = 'rule-engine',
    apiKey = '',
    model = '',
    voiceSample = '',
    tone = 'natural',
    temperature = 0.4
  } = options;

  const analysisBefore = analyzeText(text);

  let humanizedText = '';
  let usedProvider = provider;

  // If user selected an LLM provider and provided a key
  if (provider === 'gemini' && apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${HUMANIZER_SYSTEM_PROMPT}\n\n${voiceSample ? `Match this writer's voice sample:\n"""\n${voiceSample}\n"""\n\n` : ''}Humanize this text now:\n"""\n${text}\n"""` }]
            }
          ],
          generationConfig: {
            temperature: Number(temperature) || 0.3,
            maxOutputTokens: 4096
          }
        })
      });
      const data = await response.json();
      humanizedText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    } catch (e) {
      console.error('Gemini API call failed, falling back to rule engine:', e.message);
      usedProvider = 'rule-engine (fallback)';
    }
  } else if (provider === 'openai' && apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: HUMANIZER_SYSTEM_PROMPT },
            {
              role: 'user',
              content: `${voiceSample ? `Match this writer's voice sample:\n"""\n${voiceSample}\n"""\n\n` : ''}Humanize this text now:\n"""\n${text}\n"""`
            }
          ],
          temperature: Number(temperature) || 0.3
        })
      });
      const data = await response.json();
      humanizedText = data?.choices?.[0]?.message?.content?.trim() || '';
    } catch (e) {
      console.error('OpenAI API call failed, falling back to rule engine:', e.message);
      usedProvider = 'rule-engine (fallback)';
    }
  } else if (provider === 'ollama') {
    try {
      const ollamaUrl = options.endpoint || 'http://localhost:11434/api/generate';
      const response = await fetch(ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model || 'llama3',
          prompt: `${HUMANIZER_SYSTEM_PROMPT}\n\n${voiceSample ? `Voice sample:\n${voiceSample}\n\n` : ''}Text to humanize:\n${text}`,
          stream: false
        })
      });
      const data = await response.json();
      humanizedText = data?.response?.trim() || '';
    } catch (e) {
      console.error('Ollama call failed, falling back to rule engine:', e.message);
      usedProvider = 'rule-engine (fallback)';
    }
  }

  // If no LLM text generated or provider is rule-engine, run built-in deterministic engine
  if (!humanizedText) {
    humanizedText = humanizeWithRuleEngine(text, { voiceSample, tone });
    usedProvider = 'rule-engine';
  }

  // Ensure humanizedText has dashes stripped if no sample used dashes
  if (!/—|–|--/.test(voiceSample)) {
    humanizedText = humanizedText.replace(/\s*—\s*/g, ', ').replace(/\s*–\s*/g, ', ');
  }

  const analysisAfter = analyzeText(humanizedText);

  // Compute reduction metrics
  const tellsEliminated = Math.max(0, analysisBefore.summary.totalTells - analysisAfter.summary.totalTells);
  const reductionPercentage = analysisBefore.summary.totalTells > 0
    ? Math.round((tellsEliminated / analysisBefore.summary.totalTells) * 100)
    : 100;

  return {
    originalText: text,
    humanizedText,
    provider: usedProvider,
    analysisBefore: analysisBefore.summary,
    analysisAfter: analysisAfter.summary,
    tellsBefore: analysisBefore.tells,
    tellsAfter: analysisAfter.tells,
    metrics: {
      tellsEliminated,
      reductionPercentage,
      wordsBefore: analysisBefore.summary.wordCount,
      wordsAfter: analysisAfter.summary.wordCount,
      burstinessChange: analysisAfter.summary.burstinessScore - analysisBefore.summary.burstinessScore
    }
  };
}
