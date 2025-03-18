export * from "@/lib/appwrite/auth";
import {
  ID,
  databases,
  appwriteConfig,
  Query,
} from "@/lib/appwrite/config";

export async function addPostToDB(postContent: string, userId: string){
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        content: postContent,
        userId,
      }
    );

    return newPost;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getAllPostsFromDB(){
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getPostFromDB(postId: string){
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    return post;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function addResponseToDB(responseContent: string, postId: string){
  try {
    const newResponse = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      ID.unique(),
      {
        content: responseContent,
        postId,
      }
    );

    return newResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getResponsesToPost(postId: string){
  try {
    const responses = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      [Query.equal("postId", postId)]
    );

    return responses.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}