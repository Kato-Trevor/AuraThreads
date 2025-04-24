import { ID, databases, Query, appwriteConfig } from "@/lib/appwrite/config";

// Create a new journal page
export async function createJournalPage(
  userId: string,
  pageTitle: string,
  pageContent: string,
  isBookmarked: boolean = false,
  pageNumber: number
): Promise<any> {
  try {
    const newPage = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.journalsCollectionId,
      ID.unique(),
      {
        userId,
        pageTitle,
        pageContent,
        isBookmarked,
        pageNumber,
      }
    );
    return newPage;
  } catch (error: any) {
    throw new Error(`Failed to create journal page: ${error.message}`);
  }
}

// Get all journal pages for a user (sorted by page number)
export async function getUserJournalPages(userId: string): Promise<any[]> {
  try {
    const pages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.journalsCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderAsc("pageNumber") // Sort by pageNumber
      ]
    );
    return pages.documents;
  } catch (error: any) {
    throw new Error(`Failed to get journal pages: ${error.message}`);
  }
}

// Update a journal page
export async function updateJournalPage(
  pageId: string,
  updates: {
    pageTitle?: string;
    pageContent?: string;
    isBookmarked?: boolean;
    pageNumber?: number;
  }
): Promise<any> {
  try {
    const updatedPage = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.journalsCollectionId,
      pageId,
      {
        ...updates
      }
    );
    return updatedPage;
  } catch (error: any) {
    throw new Error(`Failed to update journal page: ${error.message}`);
  }
}



// Add this to your existing appwrite functions file
export async function deleteJournalPage(pageId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.journalsCollectionId,
      pageId
    );
  } catch (error: any) {
    throw new Error(`Failed to delete journal page: ${error.message}`);
  }
}

// Get bookmarked journal pages for a user (sorted by page number)
export async function getBookmarkedJournalPages(
  userId: string
): Promise<any[]> {
  try {
    const pages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.journalsCollectionId,
      [
        Query.equal("userId", userId),
        Query.equal("isBookmarked", true),
        Query.orderAsc("pageNumber") // Sort by pageNumber
      ]
    );
    return pages.documents;
  } catch (error: any) {
    throw new Error(`Failed to get bookmarked journal pages: ${error.message}`);
  }
}