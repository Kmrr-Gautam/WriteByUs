import { HUMANIZER_RULES, RULE_CATEGORIES } from './rules.js';

/**
 * Analyzes text for all 26 AI writing tells according to blader/humanizer.
 */
export function analyzeText(text) {
  if (!text || typeof text !== 'string') {
    return {
      tells: [],
      summary: {
        totalTells: 0,
        strongTells: 0,
        moderateTells: 0,
        weakTells: 0,
        aiTellDensityScore: 0,
        burstinessScore: 0,
        sentenceCount: 0,
        wordCount: 0,
        categoryCounts: {}
      }
    };
  }

  const tells = [];
  const lines = text.split('\n');

  // Compute line offset positions
  const lineOffsets = [];
  let currentOffset = 0;
  for (let i = 0; i < lines.length; i++) {
    lineOffsets.push(currentOffset);
    currentOffset += lines[i].length + 1; // +1 for \n
  }

  function getLineNumber(charIndex) {
    let low = 0, high = lineOffsets.length - 1;
    let foundLine = 0;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (lineOffsets[mid] <= charIndex) {
        foundLine = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return foundLine + 1; // 1-indexed
  }

  for (const rule of HUMANIZER_RULES) {
    for (const pattern of rule.patterns) {
      // Clone regex to ensure global state reset
      const regex = new RegExp(pattern.source, pattern.flags);
      let match;

      while ((match = regex.exec(text)) !== null) {
        const matchText = match[0];
        const startIndex = match.index;
        const endIndex = startIndex + matchText.length;
        const lineNumber = getLineNumber(startIndex);

        // Extract surrounding context snippet (up to 40 chars before & after)
        const contextStart = Math.max(0, startIndex - 30);
        const contextEnd = Math.min(text.length, endIndex + 30);
        const snippet = text.substring(contextStart, contextEnd);

        tells.push({
          ruleId: rule.id,
          section: rule.section,
          category: rule.category,
          categoryName: RULE_CATEGORIES[rule.category]?.name || 'Other',
          ruleName: rule.name,
          severity: rule.severity,
          description: rule.description,
          exampleBefore: rule.exampleBefore,
          exampleAfter: rule.exampleAfter,
          matchText,
          startIndex,
          endIndex,
          lineNumber,
          snippet
        });

        // Prevent infinite loop on 0-width matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    }
  }

  // Remove duplicate overlapping tells for cleaner UI
  const uniqueTells = [];
  const seenRanges = new Set();
  for (const t of tells.sort((a, b) => a.startIndex - b.startIndex)) {
    const key = `${t.startIndex}-${t.endIndex}-${t.ruleId}`;
    if (!seenRanges.has(key)) {
      seenRanges.add(key);
      uniqueTells.push(t);
    }
  }

  // Sentence analysis & burstiness
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) || [text];
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).filter(Boolean).length);
  const wordCount = (text.match(/\b\w+\b/g) || []).length;

  let burstinessScore = 0;
  if (sentenceLengths.length > 1) {
    const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLen, 2), 0) / sentenceLengths.length;
    const stdDev = Math.sqrt(variance);
    // Burstiness index 0-100: higher means more varied human cadence, lower means mechanical AI uniformity
    burstinessScore = Math.min(100, Math.round((stdDev / (avgLen || 1)) * 50));
  } else {
    burstinessScore = 30;
  }

  // Category counts
  const categoryCounts = {};
  let strongCount = 0;
  let moderateCount = 0;
  let weakCount = 0;

  for (const t of uniqueTells) {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    if (t.severity === 'strong') strongCount++;
    else if (t.severity === 'moderate') moderateCount++;
    else weakCount++;
  }

  // Density score: estimated AI signature intensity (0% to 100%)
  const tellWeight = (strongCount * 18) + (moderateCount * 10) + (weakCount * 5);
  const normalizedDensity = Math.min(99, Math.round((tellWeight / Math.max(1, wordCount)) * 100));

  return {
    tells: uniqueTells,
    summary: {
      totalTells: uniqueTells.length,
      strongTells: strongCount,
      moderateTells: moderateCount,
      weakTells: weakCount,
      aiTellDensityScore: uniqueTells.length > 0 ? Math.max(15, normalizedDensity) : 0,
      burstinessScore,
      sentenceCount: sentences.length,
      wordCount,
      categoryCounts
    }
  };
}
