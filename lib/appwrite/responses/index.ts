import { ID, databases, appwriteConfig, Query } from "@/lib/appwrite/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    return post;
  } catch (error: any) {
    throw new Error(`Failed to fetch post: ${error.message}`);
  }
}


export async function getResponseById(responseId: string) {
  try {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      responseId
    );

    return response;
  } catch (error: any) {
    throw new Error(`Failed to fetch response: ${error.message}`);
  }
}



export async function addAIResponseToDB(
  postContent: string,
  postId: string
): Promise<any> {
  const apiKey = process.env.EXPO_PUBLIC_GEN_AI_API_KEY_2;
  if (!apiKey) {
    throw new Error("API key is not defined");
  }
  const genAI = new GoogleGenerativeAI(apiKey!);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 300,
    },
    systemInstruction:
      "You are an AI assistant providing helpful and supportive responses only where necessary, otherwise, be appropriate. Avoid asking questions or for more information in your replies. Try to be brief",
  });

  const AI_USER_ID: string = "67e02f9a00217f9c641e";

  try {
    const prompt: string = postContent;

    const result = await model.generateContent(prompt);
    const aiResponse: string = result.response.text();

    const newResponse = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      ID.unique(),
      {
        content: aiResponse,
        postId,
        userId: AI_USER_ID,
        isAnonymous: false,
      }
    );
    return newResponse;
  } catch (error: any) {
    throw new Error(error.message || error);
  }
}
