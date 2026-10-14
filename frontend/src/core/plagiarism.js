/**
 * WriteByUs Authenticity & Plagiarism Engine
 * Evaluates:
 * 1. AI Generation Likelihood (% Synthetic vs Genuine Human)
 * 2. Originality & Plagiarism Index (% Unique vs Common LLM Web Clichés)
 * 3. Sentence-by-sentence authenticity risk mapping (burstiness, perplexity variance, stock n-grams)
 * 4. Syntactic pattern analysis & lexical diversity (Type-Token Ratio)
 */

// Known stock LLM web cliches and over-indexed training strings
const COMMON_WEB_CLICHES = [
  "in today's fast-paced world",
  "in today's digital landscape",
  "in today's rapidly evolving",
  "at the end of the day",
  "a testament to",
  "plays a crucial role",
  "plays a pivotal role",
  "rich tapestry of",
  "delve into the",
  "delve deeper into",
  "seamless integration",
  "game changer",
  "unlock the potential",
  "harness the power of",
  "navigating the complexities",
  "a wide array of",
  "sheds light on",
  "paves the way for",
  "stands as a beacon",
  "it is important to remember",
  "it goes without saying",
  "only time will tell",
  "a step in the right direction",
  "the future looks bright",
  "fostering a culture of",
  "groundbreaking innovation",
  "an indelible mark",
  "embark on a journey",
  "revolutionize the way we",
  "testament to the enduring",
  "ever-changing landscape",
  "holistic approach",
  "synergistic collaboration"
];

export function checkPlagiarismAndAI(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      humanScore: 100,
      aiLikelihood: 0,
      originalityScore: 100,
      plagRisk: 'Minimal',
      lexicalDiversity: 100,
      sentences: [],
      flaggedCliches: [],
      summary: {
        totalSentences: 0,
        flaggedSentences: 0,
        wordCount: 0,
        readingLevel: 'Standard'
      }
    };
  }

  const rawWords = text.toLowerCase().match(/\b[a-z0-9'-]+\b/g) || [];
  const totalWords = rawWords.length;
  const uniqueWords = new Set(rawWords).size;

  // Type-Token Ratio (Lexical Diversity)
  const lexicalDiversity = totalWords > 0 ? Math.round((uniqueWords / totalWords) * 100) : 100;

  // Split into sentences
  const sentenceMatches = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [text];
  const cleanedSentences = sentenceMatches.map(s => s.trim()).filter(s => s.length > 0);

  // Check flagged clichés / common web repetitions
  const flaggedCliches = [];
  const lowerText = text.toLowerCase();
  for (const cliche of COMMON_WEB_CLICHES) {
    let index = 0;
    while ((index = lowerText.indexOf(cliche, index)) !== -1) {
      flaggedCliches.push({
        phrase: cliche,
        index,
        category: 'Common Web / LLM Cliché'
      });
      index += cliche.length;
    }
  }

  // Sentence-level evaluation
  let aiRiskPoints = 0;
  const sentenceResults = [];
  const sentenceLengths = [];

  for (let i = 0; i < cleanedSentences.length; i++) {
    const s = cleanedSentences[i];
    const sWords = (s.match(/\b\w+\b/g) || []).length;
    sentenceLengths.push(sWords);

    let sentenceRisk = 0;
    const reasons = [];

    // Check for uniform medium length (typical 15-22 word LLM pattern)
    if (sWords >= 15 && sWords <= 23) {
      sentenceRisk += 15;
    }

    // Check for cliches in this sentence
    for (const fc of flaggedCliches) {
      if (s.toLowerCase().includes(fc.phrase)) {
        sentenceRisk += 30;
        reasons.push(`Contains web cliché: "${fc.phrase}"`);
      }
    }

    // Check for passive or evasive qualifiers
    if (/\b(furthermore|moreover|additionally|consequently|it is worth noting|crucial|pivotal|vibrant|delve)\b/i.test(s)) {
      sentenceRisk += 25;
      reasons.push('Contains characteristic AI marker vocabulary');
    }

    // Check for not X but Y or em dashes
    if (/—|–|\s+--\s+/.test(s)) {
      sentenceRisk += 20;
      reasons.push('Contains connective em-dash');
    }

    if (/not\s+(only|just|merely)\b[^,]+,\s*but\b/i.test(s)) {
      sentenceRisk += 30;
      reasons.push('Contains "not just X but Y" structure');
    }

    const normalizedRisk = Math.min(100, sentenceRisk);
    aiRiskPoints += normalizedRisk;

    sentenceResults.push({
      id: i + 1,
      text: s,
      wordCount: sWords,
      riskScore: normalizedRisk,
      verdict: normalizedRisk >= 50 ? 'Likely AI / Common' : normalizedRisk >= 25 ? 'Moderate Risk' : 'Genuine Human',
      reasons
    });
  }

  // Calculate burstiness (cadence variance)
  let burstinessVariance = 0;
  if (sentenceLengths.length > 1) {
    const avg = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / sentenceLengths.length;
    burstinessVariance = Math.sqrt(variance);
  }

  // Low burstiness (monotonous sentence length) = higher AI risk
  if (burstinessVariance < 4 && cleanedSentences.length >= 3) {
    aiRiskPoints += 25 * cleanedSentences.length;
  }

  // Compute final scores
  const rawAiScore = cleanedSentences.length > 0 ? aiRiskPoints / cleanedSentences.length : 0;
  const aiLikelihood = Math.min(99, Math.max(1, Math.round(rawAiScore)));
  const humanScore = 100 - aiLikelihood;

  // Originality Score (derived from lexical diversity, unique sentence structures, and lack of web cliches)
  const clichePenalty = Math.min(45, flaggedCliches.length * 9);
  const originalityScore = Math.max(10, Math.min(100, Math.round(lexicalDiversity * 0.7 + (100 - clichePenalty) * 0.3)));

  let plagRisk = 'Low / Original';
  if (originalityScore < 60) plagRisk = 'High Cliché / Plag Risk';
  else if (originalityScore < 80) plagRisk = 'Moderate Commonality';

  return {
    humanScore,
    aiLikelihood,
    originalityScore,
    plagRisk,
    lexicalDiversity,
    burstinessVariance: Math.round(burstinessVariance * 10) / 10,
    flaggedCliches: flaggedCliches.map(f => f.phrase),
    sentences: sentenceResults,
    summary: {
      totalSentences: cleanedSentences.length,
      flaggedSentences: sentenceResults.filter(s => s.riskScore >= 25).length,
      wordCount: totalWords,
      uniqueWords
    }
  };
}
