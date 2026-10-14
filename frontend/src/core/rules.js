/**
 * Exact rule definitions from blader/humanizer (Wikipedia Signs of AI Writing)
 * Categories:
 * A: Staging instead of stating (§1 - §5)
 * B: Rhythm by rule (§6 - §11)
 * C: Inflation and borrowed authority (§12 - §18)
 * D: Formatting by rule (§19 - §21)
 * E: Leftovers from chat and draft (§22 - §25)
 * F: Writing for wrong reader (§26)
 */

export const RULE_CATEGORIES = {
  A: { id: 'A', name: 'Staging instead of stating', description: 'Signals importance or stages candor instead of adding facts' },
  B: { id: 'B', name: 'Rhythm by rule', description: 'Formulaic shapes, dashes, and triads applied mechanically' },
  C: { id: 'C', name: 'Inflation & borrowed authority', description: 'Overused stock AI vocabulary, puffery, and fake significance' },
  D: { id: 'D', name: 'Formatting by rule', description: 'Formulaic bold labels, title case headings, and decorative emojis' },
  E: { id: 'E', name: 'Leftovers & chat residue', description: 'Chatbot pleasantries, cutoff disclaimers, and meta-narration' },
  F: { id: 'F', name: 'Writing for wrong reader', description: 'Re-explaining already known context before the decision' }
};

export const HUMANIZER_RULES = [
  // §1: Not X but Y
  {
    id: 'rule-1',
    section: '§1',
    category: 'A',
    name: 'Not X but Y',
    severity: 'strong',
    description: "Contrasting against something no one claimed (e.g. 'It's not just a feature, it's a statement') to inflate weight without facts.",
    exampleBefore: "It's not just about the beat; it's part of the atmosphere. It's not merely a song, it's a statement.",
    exampleAfter: "The heavy beat adds to the aggressive tone.",
    patterns: [
      /\b(it'?s\s+(not\s+just|not\s+only|not\s+merely)\b[^.,;]+,\s*(it'?s|it\s+is)\b[^.,;]+)/gi,
      /\b(not\s+(just|only|merely)\s+[^.,;]+\s+but\s+(also\s+)?[^.,;]+)/gi,
      /\b(not\s+[a-z0-9\s]+\s+but\s+[a-z0-9\s]+)/gi,
      /\b(this\s+does\s+not\s+mean\s+[^.]+\.\s*it\s+means\s+[^.]+)/gi,
      /,\s*(no\s+guessing|no\s+fluff|no\s+excuses)\b/gi
    ]
  },

  // §2: One-line closers and dramatic fragments
  {
    id: 'rule-2',
    section: '§2',
    category: 'A',
    name: 'One-line closers & dramatic fragments',
    severity: 'strong',
    description: "Short rhetorical send-offs that pause on a claim rather than adding a fact.",
    exampleBefore: "AlphaEvolve arrived. No aesthetic prior. No nostalgia. The old rules were gone. Let that sink in.",
    exampleAfter: "AlphaEvolve changed the search because it did not favor symmetry.",
    patterns: [
      /\b(let\s+that\s+sink\s+in)\b[.!]*\b/gi,
      /\b(read\s+that\s+again)\b[.!]*\b/gi,
      /\b(that\s+is\s+the\s+real\s+win)\b[.!]*\b/gi,
      /\b(that\s+distinction\s+matters)\b[.!]*\b/gi,
      /\b(the\s+message\s+(was|is)\s+clear:?)/gi,
      /\b(it\s+was\s+a\s+lesson\s+in\s+[^.]+)/gi,
      /\b(this\s+shows\s+the\s+importance\s+of\s+[^.]+)/gi,
      /\b([a-z]+)\.\s+([a-z]+)\.\s+([a-z]+)\./gi, // e.g., Every. Single. Day.
      /\b(no\s+[a-z]+\.\s+no\s+[a-z]+\.)/gi
    ]
  },

  // §3: Sayings that sound deep
  {
    id: 'rule-3',
    section: '§3',
    category: 'A',
    name: 'Sayings that sound deep',
    severity: 'strong',
    description: "Ordinary points dressed as profound aphorisms or hidden truths.",
    exampleBefore: "At its core, what really matters is organizational readiness. Efficiency becomes a trap.",
    exampleAfter: "The question is whether teams can adapt to changed habits.",
    patterns: [
      /\b(at\s+its\s+core)\b/gi,
      /\b(the\s+real\s+question\s+is)\b/gi,
      /\b(what\s+really\s+matters\s+is)\b/gi,
      /\b(the\s+deeper\s+issue\s+is)\b/gi,
      /\b(the\s+heart\s+of\s+the\s+matter)\b/gi,
      /\b(\w+\s+is\s+the\s+currency\s+of\s+\w+)\b/gi,
      /\b(\w+\s+is\s+the\s+language\s+of\s+\w+)\b/gi,
      /\b(\w+\s+is\s+not\s+a\s+tool\s+but\s+a\s+mirror)\b/gi,
      /\b(\w+\s+becomes\s+a\s+trap)\b/gi,
      /\b(the\s+architecture\s+of\s+\w+)\b/gi
    ]
  },

  // §4: Staged run-up before the point
  {
    id: 'rule-4',
    section: '§4',
    category: 'A',
    name: 'Staged run-up before the point',
    severity: 'strong',
    description: "Announcing the point or staging candor instead of directly making the point.",
    exampleBefore: "Let's dive into how caching works. Here's what you need to know. Honestly? It depends.",
    exampleAfter: "Next.js caches data at multiple layers.",
    patterns: [
      /\b(let'?s\s+dive\s+in(to)?)\b/gi,
      /\b(let'?s\s+explore)\b/gi,
      /\b(let'?s\s+break\s+this\s+down)\b/gi,
      /\b(here'?s\s+what\s+you\s+need\s+to\s+know)\b/gi,
      /\b(now\s+let'?s\s+look\s+at)\b/gi,
      /\b(without\s+further\s+ado)\b/gi,
      /\b(here'?s\s+the\s+thing)\b/gi,
      /\b(the\s+thing\s+is)\b/gi,
      /\b(let'?s\s+be\s+honest)\b/gi,
      /\b(honestly\?)\b/gi,
      /\b(real\s+talk[:;,]?)\b/gi,
      /\b(heads\s+up[,:])/gi,
      /\b(quick\s+note[,:])/gi
    ]
  },

  // §5: Arguing with no one
  {
    id: 'rule-5',
    section: '§5',
    category: 'A',
    name: 'Arguing with no one',
    severity: 'strong',
    description: "Answering an imaginary objection or fake alternative not mentioned anywhere else.",
    exampleBefore: "This isn't mainly about prompt length, and I'm not arguing that docs don't matter.",
    exampleAfter: "The issue is whether the agent can use the instruction when it acts.",
    patterns: [
      /\b(this\s+isn'?t\s+(mainly\s+)?about)\b/gi,
      /\b(i'?m\s+not\s+saying\s+that?)\b/gi,
      /\b(i'?m\s+not\s+arguing\s+that?)\b/gi,
      /\b(to\s+be\s+clear[,;]?)\b/gi,
      /\b(don'?t\s+get\s+me\s+wrong[,;]?)\b/gi,
      /\b(this\s+is\s+not\s+to\s+say\s+that?)\b/gi,
      /\b(some\s+might\s+say[^,]+,\s*but)\b/gi,
      /\b(a\s+tempting\s+approach\s+would\s+be)\b/gi,
      /\b(one\s+might\s+be\s+tempted\s+to)\b/gi,
      /\b(an\s+obvious\s+approach\s+would\s+be)\b/gi,
      /\b(you\s+might\s+think[^,]+,\s*but)\b/gi,
      /\b(it\s+would\s+be\s+easy\s+to\s+just)\b/gi
    ]
  },

  // §6: Forced triads
  {
    id: 'rule-6',
    section: '§6',
    category: 'B',
    name: 'Forced triads',
    severity: 'moderate',
    description: "Packing concepts mechanically in groups of threes to sound oratorical.",
    exampleBefore: "Attendees can expect innovation, inspiration, and industry insights.",
    exampleAfter: "The event includes talks and panels.",
    patterns: [
      /\b([a-z]+),\s+([a-z]+),\s+and\s+([a-z]+)\b/gi
    ]
  },

  // §7: Repeated sentence openings
  {
    id: 'rule-7',
    section: '§7',
    category: 'B',
    name: 'Repeated sentence openings',
    severity: 'weak-alone',
    description: "Consecutive sentences beginning with identical subjects handled by rule instead of ear.",
    exampleBefore: "She noted the door. She noted the lock on it. She filed both away.",
    exampleAfter: "She noted the door and its lock, then filed both away.",
    patterns: [
      /(?:^|[.!?]\s+)(she|he|it|this|they)\s+[^.!?]+[.!?]\s+\1\s+[^.!?]+[.!?]\s+\1\s+/gi
    ]
  },

  // §8: Dashes as the universal connector
  {
    id: 'rule-8',
    section: '§8',
    category: 'B',
    name: 'Dashes as universal connector',
    severity: 'moderate',
    description: "Overusing em dashes (—), en dashes (–), or double hyphens (--) instead of deliberate punctuation.",
    exampleBefore: "The new policy — announced without warning — affects thousands of workers.",
    exampleAfter: "The new policy, announced without warning, affects thousands of workers.",
    patterns: [
      /—/g,
      /–/g,
      /\s+--\s+/g
    ]
  },

  // §9: Stacked qualifiers
  {
    id: 'rule-9',
    section: '§9',
    category: 'B',
    name: 'Stacked qualifiers',
    severity: 'weak-alone',
    description: "Layering multiple hedge words until claims sound evasive and uncertain.",
    exampleBefore: "It could potentially possibly be argued that the policy might have some effect.",
    exampleAfter: "The policy may affect outcomes.",
    patterns: [
      /\b(could\s+potentially(\s+possibly)?)\b/gi,
      /\b(might\s+arguably)\b/gi,
      /\b(in\s+some\s+cases\s+it\s+may)\b/gi,
      /\b(this\s+is\s+an\s+inference)\b/gi,
      /\b(to\s+be\s+fair[,;]?)\b/gi,
      /\b(it'?s\s+also\s+possible\s+that)\b/gi
    ]
  },

  // §10: Hyphenated pairs everywhere
  {
    id: 'rule-10',
    section: '§10',
    category: 'B',
    name: 'Hyphenated pairs everywhere',
    severity: 'weak-alone',
    description: "Leaving compound modifiers hyphenated even when positioned as predicate adjectives.",
    exampleBefore: "The process is well-documented and the plan is long-term.",
    exampleAfter: "The process is well documented and the plan is long term.",
    patterns: [
      /\b(is|are|was|were)\s+(high-quality|well-known|well-documented|long-term|real-time|client-facing)\b/gi
    ]
  },

  // §11: Passive voice & missing subjects
  {
    id: 'rule-11',
    section: '§11',
    category: 'B',
    name: 'Passive voice & missing subjects',
    severity: 'weak-alone',
    description: "Dropping the actor or omitting subjects in short staccato phrases.",
    exampleBefore: "No configuration file needed. The results are preserved automatically.",
    exampleAfter: "You do not need a configuration file. The system preserves results.",
    patterns: [
      /\b(no\s+[a-z]+\s+needed)\b/gi,
      /\b(no\s+setup\s+required)\b/gi
    ]
  },

  // §12: Overused AI words
  {
    id: 'rule-12',
    section: '§12',
    category: 'C',
    name: 'Overused stock AI vocabulary',
    severity: 'strong',
    description: "Tell-tale vocabulary disproportionately favored by LLMs post-2023.",
    exampleBefore: "A testament to Italian influence in the culinary landscape, showcasing vibrant delicacies.",
    exampleAfter: "Pasta dishes remain common, especially in the south.",
    patterns: [
      /\b(delve|delves|delving|delved)\b/gi,
      /\b(tapestry|tapestries)\b/gi,
      /\b(testament|testaments)\b/gi,
      /\b(vibrant)\b/gi,
      /\b(pivotal)\b/gi,
      /\b(crucial)\b/gi,
      /\b(intricate|intricacies)\b/gi,
      /\b(interplay)\b/gi,
      /\b(landscape)\b/gi,
      /\b(deep\s+dive)\b/gi,
      /\b(meticulous|meticulously)\b/gi,
      /\b(bolstered)\b/gi,
      /\b(align\s+with)\b/gi,
      /\b(garner|garnered|garnering)\b/gi,
      /\b(enduring)\b/gi,
      /\b(robust)\b/gi,
      /\b(showcase|showcases|showcasing)\b/gi,
      /\b(underscore|underscores|underscoring)\b/gi,
      /\b(quietly)\b/gi
    ]
  },

  // §13: Inflated significance
  {
    id: 'rule-13',
    section: '§13',
    category: 'C',
    name: 'Inflated significance & send-offs',
    severity: 'strong',
    description: "Declaring routine events to be historic turning points, or ending on cliché upbeat send-offs.",
    exampleBefore: "Established in 1989, marking a pivotal moment. The future looks bright. Exciting times ahead.",
    exampleAfter: "Established in 1989 as part of administrative decentralization.",
    patterns: [
      /\b(stands\s+as\s+a\s+testament)\b/gi,
      /\b(a\s+pivotal\s+moment)\b/gi,
      /\b(a\s+crucial\s+moment)\b/gi,
      /\b(plays\s+a\s+key\s+role)\b/gi,
      /\b(marking\s+a\s+new\s+era)\b/gi,
      /\b(underscores\s+its\s+importance)\b/gi,
      /\b(reflects\s+a\s+broader)\b/gi,
      /\b(enduring\s+legacy)\b/gi,
      /\b(setting\s+the\s+stage\s+for)\b/gi,
      /\b(evolving\s+landscape)\b/gi,
      /\b(indelible\s+mark)\b/gi,
      /\b(the\s+future\s+looks\s+bright)\b/gi,
      /\b(exciting\s+times\s+(lie\s+)?ahead)\b/gi,
      /\b(a\s+step\s+in\s+the\s+right\s+direction)\b/gi,
      /\b(continues\s+to\s+thrive)\b/gi
    ]
  },

  // §14: Vague connection or association
  {
    id: 'rule-14',
    section: '§14',
    category: 'C',
    name: 'Vague connection or association',
    severity: 'weak-alone',
    description: "Asserting connection without describing the concrete nature of the relationship.",
    exampleBefore: "He was associated with the leadership of the orchestra.",
    exampleAfter: "He founded and conducts the orchestra.",
    patterns: [
      /\b(associated\s+with)\b/gi,
      /\b(in\s+association\s+with)\b/gi,
      /\b(connected\s+to)\b/gi,
      /\b(in\s+connection\s+with)\b/gi,
      /\b(linked\s+to)\b/gi,
      /\b(tied\s+to)\b/gi
    ]
  },

  // §15: Shallow -ing riders
  {
    id: 'rule-15',
    section: '§15',
    category: 'C',
    name: 'Shallow -ing riders',
    severity: 'moderate',
    description: "Bolting an -ing participle phrase onto a simple fact to manufacture depth.",
    exampleBefore: "The temple is blue and gold, symbolizing natural beauty, reflecting community connection.",
    exampleAfter: "The temple is painted blue and gold, colors meant to evoke Texas bluebonnets.",
    patterns: [
      /,\s*(highlighting|underscoring|emphasizing|ensuring|reflecting|symbolizing|contributing\s+to|cultivating|fostering|encompassing|showcasing)\b/gi
    ]
  },

  // §16: Sales language & brochure prose
  {
    id: 'rule-16',
    section: '§16',
    category: 'C',
    name: 'Sales language & tourism puffery',
    severity: 'strong',
    description: "Overheated promotional adjectives making descriptive text read like an advertisement.",
    exampleBefore: "Nestled within the breathtaking region, a vibrant town with rich cultural heritage.",
    exampleAfter: "Alamata Raya Kobo is a town in the Gonder region.",
    patterns: [
      /\b(nestled\s+(in|within))\b/gi,
      /\b(in\s+the\s+heart\s+of)\b/gi,
      /\b(breathtaking)\b/gi,
      /\b(must-visit)\b/gi,
      /\b(stunning\s+(natural\s+)?beauty)\b/gi,
      /\b(diverse\s+array)\b/gi,
      /\b(rich\s+cultural\s+heritage)\b/gi,
      /\b(groundbreaking)\b/gi,
      /\b(unparalleled)\b/gi
    ]
  },

  // §17: Borrowed authority
  {
    id: 'rule-17',
    section: '§17',
    category: 'C',
    name: 'Borrowed authority & anonymous consensus',
    severity: 'moderate',
    description: "Leaning on unnamed 'experts' or prestige media lists to prop up an assertion.",
    exampleBefore: "Experts believe it plays a crucial role. Industry reports have noted its impact.",
    exampleAfter: "Researchers study the river for its unusual characteristics.",
    patterns: [
      /\b(experts\s+(argue|believe|suggest|note|say))\b/gi,
      /\b(observers\s+have\s+cited)\b/gi,
      /\b(industry\s+reports\s+(suggest|show|indicate))\b/gi,
      /\b(some\s+critics\s+(have\s+argued|argue))\b/gi,
      /\b(several\s+publications\s+have)\b/gi
    ]
  },

  // §18: Avoiding is, are, and has
  {
    id: 'rule-18',
    section: '§18',
    category: 'C',
    name: 'Avoiding is, are, and has',
    severity: 'moderate',
    description: "Swapping out simple verbs with bureaucratic circumlocutions like 'serves as' or 'boasts'.",
    exampleBefore: "Gallery 825 serves as the exhibition space and boasts four separate rooms.",
    exampleAfter: "Gallery 825 is the exhibition space. The gallery has four rooms.",
    patterns: [
      /\b(serves\s+as(\s+a|\s+an)?)\b/gi,
      /\b(stands\s+as(\s+a|\s+an)?)\b/gi,
      /\b(functions\s+as(\s+a|\s+an)?)\b/gi,
      /\b(operates\s+as(\s+a|\s+an)?)\b/gi,
      /\b(boasts\s+(a|an|over|more\s+than)?)\b/gi
    ]
  },

  // §19: Bold as decoration
  {
    id: 'rule-19',
    section: '§19',
    category: 'D',
    name: 'Bold as decoration',
    severity: 'moderate',
    description: "Mechanical bolding of every list item or concept with bulleted labels and colons.",
    exampleBefore: "- **User Experience:** Improved interface.\n- **Performance:** Enhanced algorithms.",
    exampleAfter: "The update improves the interface and speeds up load times.",
    patterns: [
      /^\s*[-*]\s+\*\*([^*]+)\*\*:\s+/gm
    ]
  },

  // §20: Decorative headings & emojis
  {
    id: 'rule-20',
    section: '§20',
    category: 'D',
    name: 'Decorative headings & emojis',
    severity: 'moderate',
    description: "Adding emojis or arrows to headings and capitalizing every word.",
    exampleBefore: "🚀 **Launch Phase:** The product launches in Q3.",
    exampleAfter: "The product launches in Q3.",
    patterns: [
      /^[#\s]*([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*)+/u,
      /^\s*[-*]\s*[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u
    ]
  },

  // §21: Curly quotation marks
  {
    id: 'rule-21',
    section: '§21',
    category: 'D',
    name: 'Curly quotation marks',
    severity: 'weak-alone',
    description: "Curved typographical quotes inserted into plain markdown or technical prose.",
    exampleBefore: "He said “the project is on track”.",
    exampleAfter: "He said \"the project is on track\".",
    patterns: [
      /[“”‘’]/g
    ]
  },

  // §22: Chatbot residue
  {
    id: 'rule-22',
    section: '§22',
    category: 'E',
    name: 'Chatbot residue & conversational wrappers',
    severity: 'strong',
    description: "Chatbot pleasantries, greetings, and closing offers left in standalone text.",
    exampleBefore: "Great question! Here is an overview. I hope this helps! Let me know if you want more.",
    exampleAfter: "Here is an overview.",
    patterns: [
      /\b(i\s+hope\s+this\s+helps[!.]*)/gi,
      /\b(great\s+question[!.]*)/gi,
      /\b(certainly[!.]*)/gi,
      /\b(of\s+course[!.]*)/gi,
      /\b(you'?re\s+absolutely\s+right[!.]*)/gi,
      /\b(would\s+you\s+like\s+me\s+to\s+[^.?]+[.?])/gi,
      /\b(let\s+me\s+know\s+if\s+you('d|\s+would)\s+like\s+[^.]+)/gi,
      /\b(here\s+is\s+a\s+breakdown\s+of\s+[^:]+:)/gi,
      /\b(in\s+conclusion,\s+it\s+is\s+clear\s+that)/gi
    ]
  },

  // §23: Knowledge-limit disclaimers and guesses
  {
    id: 'rule-23',
    section: '§23',
    category: 'E',
    name: 'Knowledge-limit disclaimers & guesses',
    severity: 'strong',
    description: "Announcing model training cutoffs or filling information gaps with speculation.",
    exampleBefore: "While details are limited in available sources, she likely grew up in a middle-class home.",
    exampleAfter: "Her early life is not documented in available sources.",
    patterns: [
      /\b(as\s+of\s+(my\s+)?(last\s+)?(training\s+)?(update|date))\b/gi,
      /\b(while\s+specific\s+details\s+are\s+limited)\b/gi,
      /\b(based\s+on\s+available\s+information)\b/gi,
      /\b(not\s+publicly\s+available,\s*suggesting\s+[^.]+)/gi,
      /\b(maintains\s+a\s+low\s+profile)\b/gi,
      /\b(it\s+is\s+believed\s+that)\b/gi
    ]
  },

  // §24: Heading repeated in first sentence
  {
    id: 'rule-24',
    section: '§24',
    category: 'E',
    name: 'Heading repeated in first sentence',
    severity: 'moderate',
    description: "Echoing the exact heading text in a one-line opener paragraph.",
    exampleBefore: "## Performance\nSpeed matters.\nWhen users hit a slow page, they leave.",
    exampleAfter: "## Performance\nWhen users hit a slow page, they leave.",
    patterns: [
      /^#{1,6}\s+([^\n]+)\n+\1/gim
    ]
  },

  // §25: Writing about the document instead of its subject
  {
    id: 'rule-25',
    section: '§25',
    category: 'E',
    name: 'Writing about the document (meta-narration)',
    severity: 'moderate',
    description: "Narrating how the document was researched or compiled instead of presenting the content.",
    exampleBefore: "This function was added to replace the previous approach of iterating through all items.",
    exampleAfter: "This function uses a hash map for O(1) lookups.",
    patterns: [
      /\b(was\s+added\s+to\s+replace\s+the\s+previous\s+approach)\b/gi,
      /\b(the\s+figures\s+below\s+are\s+drawn\s+from)\b/gi,
      /\b(the\s+table\s+below\s+compares)\b/gi,
      /\b(this\s+section\s+is\s+organized\s+by)\b/gi
    ]
  },

  // §26: Re-explaining what the reader knows
  {
    id: 'rule-26',
    section: '§26',
    category: 'F',
    name: 'Re-explaining what the reader already knows',
    severity: 'moderate',
    description: "Dumping diagnostic steps and accepted premises before delivering the decision.",
    exampleBefore: "Yeah you're right, this works around the issue. The real fix is in MergeService...",
    exampleAfter: "Agreed, this is a workaround. Let's open a separate ticket for MergeService.",
    patterns: [
      /\b(as\s+you\s+(already\s+)?know[,;]?)\b/gi,
      /\b(as\s+mentioned\s+(earlier|above)[,;]?)\b/gi
    ]
  }
];
