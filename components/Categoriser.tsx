import { GoogleGenerativeAI } from "@google/generative-ai";


export async function categorizePost(
  content: string
): Promise<{ topic: string; contentType: boolean; isSafe: boolean }> {
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
    systemInstruction: `You are a mental health classifier and moderator. Analyze the given text and:
1. Categorize it into the most appropriate of these specific topics:
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
   - General

2. Determine if it's a story/experience (true/false)
3. Check if it's safe content (true/false) by looking for:
   - Hate speech or discrimination
   - Explicit violence
   - Cyberbullying or harassment
   - Inappropriate sexual content
   - Harmful misinformation

Respond ONLY with the topic, experience flag, and safety flag in the exact format "topic, true/false, true/false". Example: "Depression, true, true" or "General, false, false"`,
  });

  // Validate content first
  if (!content.trim()) {
    throw new Error("Empty content cannot be categorized");
  }

  try {
    const prompt = content;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    console.log("Generated response:", responseText);

    // Expecting a format like: "Depression, true, true"
    const parts = responseText.split(",");
    if (parts.length !== 3) {
      throw new Error(`Unexpected response format: "${responseText}"`);
    }

    // Trim the parts to clean up any extra spaces.
    const topic = parts[0].trim();
    const isExperienceStr = parts[1].trim().toLowerCase();
    const isSafeStr = parts[2].trim().toLowerCase();

    const validTopics = [
      "Anxiety",
      "Depression",
      "Confidence",
      "Relationships",
      "Stress",
      "Trauma",
      "Grief",
      "Loneliness",
      "Burnout",
      "Addiction",
      "Sleep",
      "Anger",
      "Identity",
      "Motivation",
      "Focus",
      "Fear",
      "Self-Harm",
      "Social Pressure",
      "General",
    ];

    // Validate that the topic is in our list.
    if (!validTopics.includes(topic)) {
      throw new Error(`Invalid topic response: "${topic}"`);
    }

    // Validate and convert contentType to boolean.
    let contentType: boolean;
    if (isExperienceStr === "true") {
      contentType = true;
    } else if (isExperienceStr === "false") {
      contentType = false;
    } else {
      throw new Error(`Unexpected experience response: "${isExperienceStr}"`);
    }

    // Validate and convert isSafe to boolean.
    let isSafe: boolean;
    if (isSafeStr === "true") {
      isSafe = true;
    } else if (isSafeStr === "false") {
      isSafe = false;
    } else {
      throw new Error(`Unexpected safety response: "${isSafeStr}"`);
    }

    return { topic, contentType, isSafe };
  } catch (error) {
    console.error("Post categorization failed:", error);
    throw new Error(
      `Failed to categorize post: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}



export async function categorizeResponse(
  content: string
): Promise<{ contentType: boolean; isSafe: boolean }> {
  const apiKey = process.env.EXPO_PUBLIC_GEN_AI_API_KEY_2;
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
    systemInstruction: `You are a mental health content moderator. Analyze the given response text for two things:
1. Is it a meaningful story/experience? (true/false)
2. Is it safe and constructive content? Check for:
   - Hate speech or discrimination
   - Explicit violence or self-harm
   - Cyberbullying or harassment
   - Inappropriate sexual content
   - Harmful misinformation
   Return false if any toxic content is detected, true if content is safe.

Respond ONLY with two values in format "experience,safe" where both values are true/false. Example: "true,true" or "false,false"`,
  });

  // Validate content first
  if (!content.trim()) {
    throw new Error("Empty content cannot be categorized");
  }

  try {
    const prompt = content;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim().toLowerCase();
    console.log("Generated response:", responseText);

    const [experienceStr, safetyStr] = responseText.split(",");

    if (!experienceStr || !safetyStr) {
      throw new Error(`Invalid response format: "${responseText}"`);
    }

    const contentType = experienceStr === "true";
    const isSafe = safetyStr === "true";

    if (
      ![experienceStr, safetyStr].every(
        (val) => val === "true" || val === "false"
      )
    ) {
      throw new Error(`Unexpected response values: "${responseText}"`);
    }

    return { contentType, isSafe };
  } catch (error) {
    console.error("Content categorization failed:", error);
    throw new Error(
      `Failed to categorize content: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

