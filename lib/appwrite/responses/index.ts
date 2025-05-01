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

export async function getResponsesByUserID(userId: string) {
  try {
    const responses = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      [Query.equal("userId", userId)]
    );

    return responses.documents;
  } catch (error: any) {
    throw new Error(error);
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
      "Provide helpful mental health solutions if there is a real issue, otherwise simply provide an appropriate response. Avoid asking questions in your replies. Avoid unnecessarily lengthy responses",
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
    console.error("Error adding AI response to DB:", error);
    throw new Error(error.message || error);
  }
}


export async function getExperienceResponsesByTopic(topic: string) {
  try {
    const topicPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("topic", topic)]
    );

    const postIds = topicPosts.documents.map(post => post.$id);

    const responses = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      [
        Query.equal("isExperience", true),
        Query.equal("postId", postIds), 
        Query.orderDesc("$createdAt") 
      ]
    );
    return responses.documents;
  } catch (error: any) {
    throw new Error(`Failed to fetch responses: ${error.message}`);
  }
}


export async function getExperienceResponses() {
  try {
    const responses = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      [
        Query.equal("isExperience", true),
        Query.orderDesc("$createdAt")
      ]
    );
    return responses.documents;
  } catch (error: any) {
    throw new Error(`Failed to fetch responses: ${error.message}`);
  }
}