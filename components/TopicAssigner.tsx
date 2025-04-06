import { GoogleGenerativeAI } from "@google/generative-ai";

export async function categorizePostTopic(content: string): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GEN_AI_API_KEY;   
  if (!apiKey) {
    throw new Error("API key is not defined");
  }
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