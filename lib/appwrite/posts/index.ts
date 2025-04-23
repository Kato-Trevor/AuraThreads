import { ID, databases, appwriteConfig, Query } from "@/lib/appwrite/config";

export async function addPostToDB(
  postContent: string,
  userId: string,
  topic: string,
  isExperience: boolean,
  isAnonymous: boolean,
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
        isAnonymous,
        isExperience,
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

    return posts.documents.length > 0 ? posts.documents : [];
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getPostsByUserID(userId: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("userId", userId)]
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
  userId: string,
  isExperience: boolean,
  isAnonymous: boolean
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
        isExperience,
        isAnonymous,
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
      [
        Query.or([
          Query.search("content", query),
          Query.search("topic", query),
        ]),
        Query.notEqual("userId", userId),
      ]
    );

    return posts.documents;
  } catch (error: any) {
    console.error("Error searching posts:", error);
    throw new Error(error.message);
  }
};

export async function getExperiencePostsByTopic(topic: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [
        Query.equal("topic", topic),
        Query.equal("isExperience", true),
        // Optional: Add sorting (e.g., newest first)
        Query.orderDesc("$createdAt"),
      ]
    );

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getExperiencePosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("isExperience", true)]
    );

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getMostUsedTopics() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.limit(100)]
    );

    const topicsCount: { [key: string]: number } = {};

    posts.documents.forEach((post) => {
      if (post.topic && post.topic !== "None") {
        topicsCount[post.topic] = (topicsCount[post.topic] || 0) + 1;
      }
    });

    // Sort topics by count in descending order
    const sortedTopics = Object.entries(topicsCount).sort(
      (a, b) => b[1] - a[1]
    );

    // Get the top 6 most used topics or default to an empty array if none
    const mostUsedTopics =
      sortedTopics.length > 0
        ? sortedTopics.slice(0, 6).map((topic) => topic[0])
        : [];
    console.log("Most used topics:", mostUsedTopics);

    return mostUsedTopics;
  } catch (error: any) {
    console.error("Error fetching most used topics:", error);
  }
}
