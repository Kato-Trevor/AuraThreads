import { databases, appwriteConfig, Query, ID } from "@/lib/appwrite/config";

export async function addBookmarkToDB(userId: string, postId: string) {
  try {
    const newBookmark = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookmarksCollectionId,
      ID.unique(),
      {
        userId: userId, 
        postId: postId   
      }
    );
    return newBookmark;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

export async function getBookmarksByUserID(userId: string): Promise<any[]> {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookmarksCollectionId,
      [ Query.equal("userId", userId) ]
    );
    return result.documents;
  } catch (error: any) {
    throw new Error(`Failed to get bookmarks: ${error.message}`);
  }
}

export async function deleteBookmarkFromDB(bookmarkId: string) {
  try {
    return await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookmarksCollectionId,
      bookmarkId
    );
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}