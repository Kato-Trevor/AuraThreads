import { ID, databases, appwriteConfig, Query } from "@/lib/appwrite/config";

export async function addPostToDB(
  postContent: string,
  userId: string,
  topic: string,
  songId?: number
) {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        content: postContent,
        userId,
        topic,
        songId,
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

export async function getPostsByTopic(topic: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("topic", topic)]
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

export const searchPosts = async (query: any, userId: string) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("content", query), Query.notEqual("userId", userId)]
    );

    return posts.documents;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
