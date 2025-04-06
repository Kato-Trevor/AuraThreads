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
  
 