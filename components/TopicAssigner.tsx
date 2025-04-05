// const topicKeywords: Record<string, string[]> = {
//   Anxiety: [
//     'anxious', 'anxiety', 'nervous', 'panic', 'worried', 'worry', 'fear', 
//     'scared', 'overwhelmed', 'uneasy', 'apprehensive', 'stressed', 
//     'racing thoughts', 'on edge', 'panic attack'
//   ],
//   Depression: [
//     'depressed', 'depression', 'sad', 'hopeless', 'empty', 'lonely', 
//     'tired', 'fatigued', 'worthless', 'guilty', 'suicidal', 
//     'no energy', 'can\'t get up', 'nothing matters', 'cry', 'crying'
//   ],
//   'Academic Life': [
//     'school', 'college', 'university', 'exam', 'test', 'grades', 
//     'homework', 'assignment', 'professor', 'teacher', 'lecture', 
//     'study', 'studying', 'gpa', 'fail', 'failing', 'drop out', 'thesis'
//   ],
//   'Time Management': [
//     'procrastinate', 'procrastination', 'deadline', 'late', 
//     'schedule', 'time management', 'organized', 'organization', 
//     'overwhelmed', 'too much work', 'not enough time', 'time', 
//     'balance', 'prioritize', 'distracted'
//   ],
//   Burnout: [
//     'burnout', 'burn out', 'exhausted', 'drained', 'overworked', 
//     'no motivation', 'can\'t focus', 'cynical', 'detached', 
//     'no satisfaction', 'emotional exhaustion', 'tired all the time', 
//     'work fatigue'
//   ],
//   'Social Pressure': [
//     'peer pressure', 'fit in', 'social anxiety', 'awkward', 
//     'judged', 'fomo', 'left out', 'excluded', 'embarrassed', 
//     'what others think', 'social norms', 'conform', 'pressure'
//   ],
//   Loneliness: [
//     'lonely', 'alone', 'isolated', 'no friends', 'no one understands', 
//     'left out', 'empty', 'unwanted', 'abandoned', 'friendless', 
//     'social isolation', 'feeling alone'
//   ],
//   Relationships: [
//     'relationship', 'boyfriend', 'girlfriend', 'partner', 'breakup', 
//     'divorce', 'fight', 'argue', 'trust', 'cheat', 'communication', 
//     'love', 'heartbreak', 'dating', 'marriage', 'attachment'
//   ],
//   Career: [
//     'job', 'career', 'work', 'boss', 'coworker', 'promotion', 
//     'fired', 'quit', 'interview', 'resume', 'salary', 'workplace', 
//     'toxic job', 'unhappy at work', 'career change'
//   ],
//   Finance: [
//     'money', 'broke', 'debt', 'loan', 'rent', 'bills', 'paycheck', 
//     'savings', 'financial stress', 'can\'t afford', 'poor', 
//     'credit card', 'student loans', 'financial anxiety'
//   ],
//   Motivation: [
//     'motivation', 'motivated', 'unmotivated', 'lazy', 'procrastinate', 
//     'goals', 'ambition', 'drive', 'determined', 'give up', 
//     'no motivation', 'can\'t start', 'stuck', 'inspiration'
//   ],
//   Sleep: [
//     'insomnia', 'can\'t sleep', 'tired', 'exhausted', 'sleep schedule', 
//     'nightmares', 'restless', 'sleep deprived', 'oversleeping', 
//     'wake up', 'sleep quality', 'sleep problems'
//   ],
//   'Self-Improvement': [
//     'self improvement', 'better myself', 'growth', 'learn', 
//     'new skills', 'habits', 'routine', 'discipline', 
//     'productivity', 'journaling', 'meditation', 'read more', 
//     'self care', 'self development'
//   ],
//   Confidence: [
//     'confidence', 'self esteem', 'insecure', 'doubt', 
//     'imposter syndrome', 'not good enough', 'self worth', 
//     'self doubt', 'shy', 'social anxiety', 'speak up', 
//     'assertive', 'body image'
//   ],
//   Mindfulness: [
//     'mindfulness', 'meditation', 'present', 'grounding', 
//     'breathing', 'awareness', 'calm', 'peaceful', 
//     'mindful', 'zen', 'focus', 'clear mind', 'anxiety relief'
//   ],
//   Overthinking: [
//     'overthink', 'overthinking', 'ruminate', 'racing thoughts', 
//     'can\'t stop thinking', 'analyzing', 'what if', 
//     'paralysis by analysis', 'indecisive', 'second guess', 
//     'mental loops'
//   ],
//   'Personal Growth': [
//     'personal growth', 'self discovery', 'find purpose', 
//     'meaning', 'values', 'authentic', 'life changes', 
//     'transform', 'evolve', 'mature', 'life lessons', 
//     'self reflection', 'find myself'
//   ],
//   Stress: [
//     'stressed', 'stress', 'overwhelmed', 'pressure', 
//     'tension', 'headache', 'can\'t relax', 'burnout', 
//     'cortisol', 'anxious', 'nervous', 'worried', 
//     'work stress', 'life stress'
//   ]
// };




// import winkNLP from 'wink-nlp';
// import model from 'wink-eng-lite-web-model';

// // Initialize winkNLP with proper typing
// const nlp = winkNLP(model);

// // Workaround for winkNLP type issues
// const getLemmas = (text: string): string[] => {
//   const doc = nlp.readDoc(text);
//   // @ts-expect-error - winkNLP has incorrect type definitions
//   return doc.tokens().out('lemma');
// };

// // Define topics and keywords
// const topicKeywords: Record<string, string[]> = {
//   "Anxiety": [
//     "anxious", "nervous", "panic", "worried", "fear", "scared", "overwhelmed", "uneasy",
//     "apprehensive", "stressed", "racing", "jittery", "dread", "restless", "tense",
//     "shaky", "paranoid", "terrified", "frightened", "phobia", "hesitant", "panic",
//     "butterflies", "choking", "wound", "hyperventilating", "obsessive", "intrusive"
//   ],
//   "Depression": [
//     "depressed", "sad", "hopeless", "empty", "lonely", "tired", "worthless", "guilty",
//     "suicidal", "crying", "numb", "gloomy", "despair", "miserable", "apathetic",
//     "fatigued", "drained", "helpless", "sorrow", "defeated", "hollow", "weepy",
//     "joyless", "isolated", "bleak", "burdened", "lost", "broken"
//   ],
//   "Confidence": [
//     "confident", "esteem", "insecure", "doubt", "shy", "assertive", "capable",
//     "empowered", "worthy", "competent", "timid", "selfish", "inferior", "superior",
//     "validated", "respected", "weak", "strong", "fraud", "imposter", "proud",
//     "bashful", "meek", "bold", "hesitant", "selflove", "selfhate"
//   ],
//   "Relationships": [
//     "partner", "breakup", "divorce", "fight", "argue", "trust", "cheat", "communication",
//     "love", "heartbreak", "dating", "marriage", "attachment", "toxic", "abusive",
//     "neglect", "betrayal", "clingy", "distant", "jealous", "possessive", "supportive",
//     "lonely", "rejected", "abandoned", "romantic", "friendship", "family"
//   ],
//   "Stress": [
//     "stressed", "overwhelmed", "pressure", "tension", "headache", "burnout", "cortisol",
//     "frazzled", "frustrated", "agitated", "exhausted", "deadlines", "chaos", "crisis",
//     "worry", "strained", "demands", "overworked", "grind", "crushing", "unbearable",
//     "trapped", "suffocating", "relentless", "breaking"
//   ],
//   "Trauma": [
//     "trauma", "ptsd", "flashback", "triggered", "nightmares", "memories", "abuse",
//     "violent", "victim", "survivor", "haunted", "frozen", "dissociate", "numb",
//     "unsafe", "violated", "wounded", "scarred", "terror", "helpless", "horror",
//     "distrust", "hypervigilant", "reliving", "broken", "shattered"
//   ],
//   "Grief": [
//     "grief", "loss", "mourning", "death", "funeral", "sadness", "heartache", "empty",
//     "bereaved", "memorial", "goodbye", "tears", "pain", "sorrow", "anguish",
//     "devastated", "yearning", "missing", "graveyard", "burial", "condolences",
//     "unbearable", "suffering", "drowning", "aching", "regret"
//   ],
//   "Loneliness": [
//     "lonely", "alone", "isolated", "unwanted", "abandoned", "friendless", "ignored",
//     "rejected", "outcast", "disconnected", "empty", "hollow", "unloved", "unseen",
//     "invisible", "solitary", "detached", "withdrawn", "ostracized", "shunned",
//     "unnoticed", "unbelonging", "secluded", "forsaken", "alienated"
//   ],
//   "Burnout": [
//     "burnout", "exhausted", "drained", "overworked", "cynical", "detached", "fatigue",
//     "weary", "depleted", "resentful", "numb", "dread", "grind", "stagnant", "stuck",
//     "trapped", "joyless", "mechanical", "unfulfilled", "disengaged", "apathetic",
//     "spent", "defeated", "running", "empty", "hollow"
//   ],
//   "Addiction": [
//     "addiction", "relapse", "sober", "craving", "withdrawal", "temptation", "alcohol",
//     "drugs", "substance", "recovery", "clean", "compulsive", "dependent", "habit",
//     "obsession", "fix", "need", "denial", "shame", "guilt", "binge", "escapism",
//     "tolerance", "rock", "bottom", "struggle"
//   ],
//   "Sleep": [
//     "insomnia", "tired", "exhausted", "nightmares", "restless", "oversleeping",
//     "waking", "fatigue", "groggy", "drowsy", "sleepy", "sleepless", "awake",
//     "paralysis", "snoring", "apnea", "dreams", "terrors", "napping", "yawning",
//     "sluggish", "jetlag", "circadian", "twitch", "recharge", "deprived"
//   ],
//   "Anger": [
//     "angry", "rage", "furious", "irritated", "resentful", "bitter", "hostile",
//     "livid", "outraged", "fuming", "seething", "annoyed", "aggressive", "temper",
//     "hatred", "vengeful", "frustrated", "betrayed", "disrespected", "provoked",
//     "volatile", "grudge", "infuriated", "wrath", "violence", "tantrum"
//   ],
//   "Identity": [
//     "identity", "confused", "lost", "purpose", "questioning", "gender", "sexuality",
//     "race", "culture", "belonging", "authentic", "fake", "mask", "acceptance",
//     "alienation", "self", "values", "faith", "beliefs", "doubt", "fluid", "crisis",
//     "searching", "reinvention", "transformation", "journey"
//   ],
//   "Motivation": [
//     "motivated", "unmotivated", "lazy", "procrastinate", "goals", "ambition",
//     "drive", "determined", "stuck", "inspiration", "passion", "purpose", "energized",
//     "defeated", "giving", "up", "hopeless", "spark", "grind", "hustle", "discipline",
//     "reward", "punishment", "reward", "slump", "uninspired"
//   ],
//   "Focus": [
//     "focus", "distracted", "adhd", "concentration", "scatterbrained", "forgetful",
//     "scattered", "overwhelmed", "chaotic", "mindful", "present", "drifting",
//     "daydreaming", "foggy", "clarity", "sharp", "zoning", "hyperfocus", "obsessive",
//     "fixation", "wandering", "attention", "disorganized", "prioritize", "multitasking"
//   ],
//   "Fear": [
//     "fear", "scared", "terrified", "phobia", "panic", "anxious", "dread", "horror",
//     "intimidation", "vulnerable", "threat", "unsafe", "paralyzed", "coward", "brave",
//     "courage", "shaking", "petrified", "haunted", "terror", "nightmare", "worry",
//     "apprehension", "insecurity", "overcome", "avoidance"
//   ],
//   "Self-Harm": [
//     "selfharm", "cutting", "suicidal", "bleeding", "scars", "pain", "punishment",
//     "guilt", "shame", "numb", "release", "triggered", "relapse", "urges", "recovery",
//     "struggle", "secret", "hidden", "addiction", "control", "helpless", "despair",
//     "worthless", "broken", "isolated", "therapy"
//   ],
//   "Social Pressure": [
//     "pressure", "expectations", "judged", "fomo", "excluded", "embarrassed",  
//     "norms", "conform", "fitting", "comparison", "approval", "validation",  
//     "rejected", "awkward", "outcast", "trends", "popular", "uncool",  
//     "ridiculed", "teased", "bullying", "status", "competition", "keepingup",  
//     "insecure", "inferior", "superior", "alienated", "ostracized", "misfit",  
//     "unaccepted", "unwanted", "disliked", "unpopular", "sheep", "follow",  
//     "crowd", "opinions", "canceled", "shamed", "guilted", "obligation",  
//     "perform", "fake", "mask", "pretend", "facade", "expect", "demands",  
//     "disappoint", "letdown", "criticism", "silenced", "voiceless", "trapped"  
//   ]
// }

// const DEFAULT_TOPIC = 'Generic Statement';

// /**
//  * Assign topic to content using lemmatized matching
//  */
// export const assignPostTopic = (content: string): string => {
//   if (!content.trim()) return DEFAULT_TOPIC;

//   // Get lemmatized content words
//   const contentLemmas = getLemmas(content.toLowerCase());

//   // Pre-process all keywords
//   const processedKeywords: Record<string, string[]> = {};
//   Object.entries(topicKeywords).forEach(([topic, keywords]) => {
//     processedKeywords[topic] = keywords.flatMap(keyword =>
//       getLemmas(keyword.toLowerCase())
//     );
//   });

//   // Score topics
//   const topicScores: Record<string, number> = {};
//   Object.entries(processedKeywords).forEach(([topic, lemmas]) => {
//     topicScores[topic] = lemmas.reduce((score, lemma) =>
//       contentLemmas.includes(lemma) ? score + 1 : score,
//       0);
//   });

//   // Find best match
//   const bestMatch = Object.entries(topicScores).reduce(
//     (best, [topic, score]) => score > best.score ? { topic, score } : best,
//     { topic: DEFAULT_TOPIC, score: 0 }
//   );

//   return bestMatch.score > 0 ? bestMatch.topic : DEFAULT_TOPIC;
// };

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function categorizePostTopic(content: string): Promise<string> {
  const apiKey = "AIzaSyCw3mE41_qfuntNRbyvPzavS9u3Nl4npS0";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      maxOutputTokens: 50,
    },
    systemInstruction: `You are a mental health topic classifier. Analyze the given text and categorize it into the most appropriate of these specific topics:
    - Anxiety
    - Depression
    - Confidence
    - Relationships
    - Stress
    - Trauma
    - Grief
    - Loneliness
    - Burnout
    - Addiction
    - Sleep
    - Anger
    - Identity
    - Motivation
    - Focus
    - Fear
    - Self-Harm
    - Social Pressure
    - None
    
    Respond ONLY with the exact topic name from the list above, nothing else.` 
  });

  // Validate content first
  if (!content.trim()) {
    throw new Error("Empty content cannot be categorized");
  }

  try {
    const prompt = content;
    const result = await model.generateContent(prompt);
    const topic = result.response.text().trim();
    
    const validTopics = [
      'Anxiety', 'Depression', 'Confidence', 'Relationships', 'Stress', 
      'Trauma', 'Grief', 'Loneliness', 'Burnout', 'Addiction', 'Sleep', 
      'Anger', 'Identity', 'Motivation', 'Focus', 'Fear', 'Self-Harm', 
      'Social Pressure', 'None'
    ];
    
    if (!validTopics.includes(topic)) {
      throw new Error(`Invalid topic response: "${topic}"`);
    }
    
    return topic;
  } catch (error) {
    console.error("Topic categorization failed:", error);
    throw new Error(`Failed to categorize content: ${error instanceof Error ? error.message : String(error)}`);
  }
}