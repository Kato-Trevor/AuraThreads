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








import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

// Initialize winkNLP with proper typing
const nlp = winkNLP(model);

// Workaround for winkNLP type issues
const getLemmas = (text: string): string[] => {
  const doc = nlp.readDoc(text);
  // @ts-expect-error - winkNLP has incorrect type definitions
  return doc.tokens().out('lemma');
};

// Define topics and keywords
const topicKeywords: Record<string, string[]> = {
  Anxiety: [
    'anxious', 'anxiety', 'nervous', 'panic', 'worried', 'worry', 'fear', 
    'scared', 'overwhelmed', 'uneasy', 'apprehensive', 'stressed', 
    'racing', 'edge', 'panic attack'
  ],
  Depression: [
    'depressed', 'depression', 'sad', 'hopeless', 'empty', 'lonely', 
    'tired','worthless', 'guilty', 'suicidal', 'cry', 'crying'
  ],
  'Academic Life': [
    'school', 'college', 'university', 'exam', 'test', 'grades', 
    'homework', 'assignment', 'professor', 'teacher', 'lecture', 
    'studying', 'gpa', 'thesis', 'books'
  ],
  'Time Management': [
    'procrastinate', 'procrastination', 'deadline', 'late', 
    'schedule', 'time', 'organized',  
    'overwhelmed','balance', 'prioritize', 'distracted'
  ],
  Burnout: [
    'burnout', 'burn out', 'exhausted', 'drained', 'overworked', 
    'cynical', 'detached', 'exhaustion', 'tired', 'fatigue'
  ],
  'Social Pressure': [
    'pressure', 'awkward', 
    'judged', 'fomo', 'excluded', 'embarrassed', 'norms', 'conform', 'pressure'
  ],
  Loneliness: [
    'lonely', 'alone', 'isolated', 'empty', 'unwanted', 'abandoned', 'friendless'
  ],
  Relationships: [
    'relationship', 'boyfriend', 'girlfriend', 'partner', 'breakup', 
    'divorce', 'fight', 'argue', 'trust', 'cheat', 'communication', 
    'love', 'heartbreak', 'dating', 'marriage', 'attachment'
  ],
  Career: [
    'job', 'career', 'work', 'boss', 'coworker', 'promotion', 
    'fired', 'interview', 'resume', 'salary', 'workplace', 
    'job'
  ],
  Finance: [
    'money', 'broke', 'debt', 'loan', 'rent', 'bills', 'paycheck', 
    'savings','afford', 'poor', 'credit', 'loans', 'financial'
  ],
  Motivation: [
    'motivation', 'unmotivated', 'lazy', 'procrastinate', 
    'goals', 'ambition', 'drive', 'determined', 'stuck', 'inspiration'
  ],
  Sleep: [
    'insomnia', 'sleep', 'tired', 'exhausted', 
    'nightmares', 'restless', 'oversleeping', 'wake'
  ],
  'Self-Improvement': [
    'self improvement', 'myself', 'growth', 'learn', 
    'new skills', 'habits', 'routine', 'discipline', 
    'productivity', 'journaling', 'meditation',  
    'care', 'development'
  ],
  Confidence: [
    'confidence', 'esteem', 'insecure', 'doubt', 'shy', 'assertive'
  ],
  Mindfulness: [
    'mindfulness', 'meditation', 'present', 'grounding', 
    'breathing', 'awareness', 'calm', 'peaceful', 
    'mindful', 'zen', 'focus'
  ],
  Overthinking: [
    'overthink', 'overthinking', 'ruminate', 'indecisive',  
    'loops'
  ],
  'Personal Growth': [
    'personal growth', 'self discovery', 'purpose', 
    'meaning', 'values', 'authentic', 'change', 
    'evolve', 'mature', 'lessons', 
    'reflection'
  ],
  Stress: [
    'stress', 'overwhelmed', 'pressure', 
    'tension', 'headache', 'relax', 'burnout', 
    'cortisol', 'anxious', 'nervous', 'worried', 
  ]
};

const DEFAULT_TOPIC = 'Generic Statement';

/**
 * Assign topic to content using lemmatized matching
 */
export const assignPostTopic = (content: string): string => {
  if (!content.trim()) return DEFAULT_TOPIC;

  // Get lemmatized content words
  const contentLemmas = getLemmas(content.toLowerCase());

  // Pre-process all keywords
  const processedKeywords: Record<string, string[]> = {};
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    processedKeywords[topic] = keywords.flatMap(keyword => 
      getLemmas(keyword.toLowerCase())
    );
  });

  // Score topics
  const topicScores: Record<string, number> = {};
  Object.entries(processedKeywords).forEach(([topic, lemmas]) => {
    topicScores[topic] = lemmas.reduce((score, lemma) => 
      contentLemmas.includes(lemma) ? score + 1 : score, 
    0);
  });

  // Find best match
  const bestMatch = Object.entries(topicScores).reduce(
    (best, [topic, score]) => score > best.score ? { topic, score } : best,
    { topic: DEFAULT_TOPIC, score: 0 }
  );

  return bestMatch.score > 0 ? bestMatch.topic : DEFAULT_TOPIC;
};