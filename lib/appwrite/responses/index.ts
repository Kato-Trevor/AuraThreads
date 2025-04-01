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
  
  

export async function addAIResponseToDB(postContent: string, postId: string): Promise<any> {

  const apiKey = "AIzaSyCw3mE41_qfuntNRbyvPzavS9u3Nl4npS0";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",  
    generationConfig: {
    temperature: 0.7, 
    topP: 0.9, 
    maxOutputTokens: 300, 
  },
  systemInstruction: "You are an AI assistant providing appropriate, helpful and supportive responses. Avoid asking questions in your replies." }); 
  
  const AI_USER_ID: string = "67e02f9a00217f9c641e"; 

  try {
    const prompt: string = postContent
    
    const result = await model.generateContent(prompt);
    const aiResponse: string = result.response.text();

    const newResponse = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      ID.unique(),
      {
        content: aiResponse,
        postId,
        userId: AI_USER_ID
      }
    );
    return newResponse;
  } catch (error: any) {
    throw new Error(error.message || error);
  }

  
}