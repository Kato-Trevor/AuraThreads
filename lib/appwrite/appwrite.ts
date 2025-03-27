export * from "@/lib/appwrite/auth";
import { ID, databases, appwriteConfig, Query } from "@/lib/appwrite/config";

export async function addPostToDB(postContent: string, userId: string, topic: string, songId?: number) {
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

export async function getReaction(userId: string, responseId: string) {
  try {
    const reactions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reactionsCollectionId,
      [Query.equal("madeBy", userId), Query.equal("reactedTo", responseId)]
    );

    if (reactions.documents.length > 0) {
      return reactions.documents[0];
    }

    return null;
  } catch (error) {
    console.error("Error getting user reaction:", error);
    throw error;
  }
}

export async function getLikeCount(responseId: string) {
  try {
    const reactions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reactionsCollectionId,
      [Query.equal("reactedTo", responseId)]
    );

    const likes = reactions.documents.filter(
      (reaction) => reaction.reactionType === "like"
    );

    return likes.length;
  } catch (error) {
    console.error("Error getting like counts:", error);
    throw error;
  }
}

export async function getDislikeCount(responseId: string) {
  try {
    const reactions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reactionsCollectionId,
      [Query.equal("reactedTo", responseId)]
    );

    const dislikes = reactions.documents.filter(
      (reaction) => reaction.reactionType === "dislike"
    );

    return dislikes.length;
  } catch (error) {
    console.error("Error getting dislike counts:", error);
    throw error;
  }
}

export async function addReaction(
  responseId: string,
  userId: string,
  reactionType: "like" | "dislike"
) {
  try {
    const newReaction = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reactionsCollectionId,
      ID.unique(),
      {
        reactedTo: responseId,
        madeBy: userId,
        reactionType,
      }
    );

    return newReaction;
  } catch (error) {
    console.error("Error creating reaction:", error);
    throw error;
  }
}

export async function updateReaction(
  reactionId: string,
  reactionType: "like" | "dislike"
) {
  try {
    const updatedReaction = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reactionsCollectionId,
      reactionId,
      {
        reactionType,
      }
    );

    return updatedReaction;
  } catch (error) {
    console.error("Error updating reaction:", error);
    throw error;
  }
}

export async function removeReaction(reactionId: string) {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reactionsCollectionId,
      reactionId
    );

    return true;
  } catch (error) {
    console.error("Error removing reaction:", error);
    throw error;
  }
}
