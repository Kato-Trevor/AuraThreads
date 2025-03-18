export * from "@/lib/appwrite/auth";
import { ID, databases, appwriteConfig, Query } from "@/lib/appwrite/config";

export async function addPostToDB(postContent: string, userId: string) {
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

export async function getAllPostsFromDB() {
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

export async function getPostFromDB(postId: string) {
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

export async function addResponseToDB(
  responseContent: string,
  postId: string,
  userId: string
) {
  try {
    const newResponse = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      ID.unique(),
      {
        content: responseContent,
        postId,
        userId,
      }
    );

    return newResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getResponsesToPost(postId: string) {
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

export async function addLikeToResponse(responseId: string, userId: string) {
  try {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      responseId
    );

    const updatedLikes = (response.likes || 0) + 1;

    const likedBy = response.likedBy || [];
    if (!likedBy.includes(userId)) {
      likedBy.push(userId);
    }

    const updatedResponse = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      responseId,
      {
        likes: updatedLikes,
        likedBy,
      }
    );
    return updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function addDislikeToResponse(responseId: string, userId: string) {
  try {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      responseId
    );

    const updatedDislikes = (response.dislikes || 0) + 1;

    const dislikedBy = response.dislikedBy || [];
    if (!dislikedBy.includes(userId)) {
      dislikedBy.push(userId);
    }

    const updatedResponse = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      responseId,
      {
        dislikes: updatedDislikes,
        dislikedBy,
      }
    );
    return updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function removeDislikeFromResponse(
  responseId: string,
  userId: string
) {
  try {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      responseId
    );

    const updatedDislikes = (response.dislikes || 0) - 1;

    const dislikedBy = response.dislikedBy || [];
    const updatedDislikedBy = dislikedBy.filter((user: any) => user.$id !== userId);

    const updatedResponse = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      responseId,
      {
        dislikes: updatedDislikes,
        dislikedBy: updatedDislikedBy,
      }
    );
    return updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function removeLikeFromResponse(
  responseId: string,
  userId: string
) {
  try {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      responseId
    );

    const updatedLikes = (response.likes || 0) - 1;

    const likedBy = response.likedBy || [];
    const updatedlikedBy = likedBy.filter((user: any) => user.$id !== userId);

    const updatedResponse = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.responsesCollectionId,
      responseId,
      {
        likes: updatedLikes,
        likedBy: updatedlikedBy,
      }
    );
    return updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}
