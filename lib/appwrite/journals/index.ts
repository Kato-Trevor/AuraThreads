// import { ID, databases, Query } from "@/lib/appwrite/config";
// import { appwriteConfig } from "@/lib/appwrite/config";


// // Create a new journal page
// export async function createJournalPage(
//   userId: string,
//   pageTitle: string,
//   pageContent: string,
//   isBookmarked: boolean = false
// ) {
//   try {
//     const newPage = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       ID.unique(),
//       {
//         userId,
//         pageTitle,
//         pageContent,
//         isBookmarked,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       }
//     );

//     return newPage;
//   } catch (error: any) {
//     throw new Error(`Failed to create journal page: ${error.message}`);
//   }
// }

// // Get all journal pages for a user (sorted by creation date)
// export async function getUserJournalPages(userId: string) {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         Query.orderDesc("createdAt")
//       ]
//     );

//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to get journal pages: ${error.message}`);
//   }
// }

// // Get a specific journal page by ID
// export async function getJournalPage(pageId: string) {
//   try {
//     const page = await databases.getDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       pageId
//     );

//     return page;
//   } catch (error: any) {
//     throw new Error(`Failed to get journal page: ${error.message}`);
//   }
// }

// // Update a journal page
// export async function updateJournalPage(
//   pageId: string,
//   updates: {
//     pageTitle?: string;
//     pageContent?: string;
//     isBookmarked?: boolean;
//   }
// ) {
//   try {
//     const updatedPage = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       pageId,
//       {
//         ...updates,
//         updatedAt: new Date().toISOString()
//       }
//     );

//     return updatedPage;
//   } catch (error: any) {
//     throw new Error(`Failed to update journal page: ${error.message}`);
//   }
// }

// // Delete a journal page (soft delete)
// export async function deleteJournalPage(pageId: string) {
//   try {
//     await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       pageId,
//       {
//         isDeleted: true,
//         updatedAt: new Date().toISOString()
//       }
//     );
//   } catch (error: any) {
//     throw new Error(`Failed to delete journal page: ${error.message}`);
//   }
// }

// // Get isBookmarked journal pages
// export async function getBookmarkedPages(userId: string) {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         Query.equal("isBookmarked", true),
//         Query.orderDesc("createdAt")
//       ]
//     );

//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to get isBookmarked pages: ${error.message}`);
//   }
// }

// // Search journal pages by pageContent or pageTitle
// export async function searchJournalPages(
//   userId: string,
//   query: string
// ) {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         Query.or([
//           Query.search("pageContent", query),
//           Query.search("pageTitle", query)
//         ])
//       ]
//     );

//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to search journal pages: ${error.message}`);
//   }
// }

// // Get journal pages by date range
// export async function getJournalPagesByDateRange(
//   userId: string,
//   startDate: string,
//   endDate: string
// ) {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         Query.greaterThanEqual("createdAt", startDate),
//         Query.lessThanEqual("createdAt", endDate),
//         Query.orderDesc("createdAt")
//       ]
//     );

//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to get pages by date range: ${error.message}`);
//   }
// }

// // Get latest journal page
// export async function getLatestJournalPage(userId: string) {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         Query.orderDesc("createdAt"),
//         Query.limit(1)
//       ]
//     );

//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to get latest journal page: ${error.message}`);
//   }
// }


// import { ID, databases, Query, appwriteConfig } from "@/lib/appwrite/config";

// // Create a new journal page
// export async function createJournalPage(
//   userId: string,
//   pageTitle: string,
//   pageContent: string,
//   isBookmarked: boolean = false
// ): Promise<any> {
//   try {
//     const newPage = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       ID.unique(),
//       {
//         userId,
//         pageTitle,
//         pageContent,
//         isBookmarked,
//         $createdAt: new Date().toISOString(),
//         $updatedAt: new Date().toISOString(),
//         isDeleted: false,
//       }
//     );
//     return newPage;
//   } catch (error: any) {
//     throw new Error(`Failed to create journal page: ${error.message}`);
//   }
// }

// // Get all journal pages for a user (sorted by creation date)
// export async function getUserJournalPages(userId: string): Promise<any[]> {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         // Query.equal("isDeleted", false),
//         Query.orderDesc("createdAt"),
//       ]
//     );
//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to get journal pages: ${error.message}`);
//   }
// }

// // Get a specific journal page by ID
// export async function getJournalPage(pageId: string): Promise<any> {
//   try {
//     const page = await databases.getDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       pageId
//     );
//     return page;
//   } catch (error: any) {
//     throw new Error(`Failed to get journal page: ${error.message}`);
//   }
// }

// // Update a journal page
// export async function updateJournalPage(
//   pageId: string,
//   updates: {
//     pageTitle?: string;
//     pageContent?: string;
//     isBookmarked?: boolean;
//   }
// ): Promise<any> {
//   try {
//     const updatedPage = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       pageId,
//       {
//         ...updates,
//         $updatedAt: new Date().toISOString(),
//       }
//     );
//     return updatedPage;
//   } catch (error: any) {
//     throw new Error(`Failed to update journal page: ${error.message}`);
//   }
// }

// // Get bookmarked journal pages
// export async function getBookmarkedPages(userId: string): Promise<any[]> {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         Query.equal("isBookmarked", true),
//         // Query.equal("isDeleted", false),
//         Query.orderDesc("createdAt"),
//       ]
//     );
//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to get bookmarked pages: ${error.message}`);
//   }
// }

// // Search journal pages by pageContent or pageTitle
// export async function searchJournalPages(
//   userId: string,
//   searchQuery: string
// ): Promise<any[]> {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         // Query.equal("isDeleted", false),
//         Query.or([
//           Query.search("pageContent", searchQuery),
//           Query.search("pageTitle", searchQuery),
//         ]),
//       ]
//     );
//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to search journal pages: ${error.message}`);
//   }
// }

// // Get journal pages by date range
// export async function getJournalPagesByDateRange(
//   userId: string,
//   startDate: string,
//   endDate: string
// ): Promise<any[]> {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         // Query.equal("isDeleted", false),
//         Query.greaterThanEqual("$createdAt", startDate),
//         Query.lessThanEqual("$createdAt", endDate),
//         Query.orderDesc("$createdAt"),
//       ]
//     );
//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to get pages by date range: ${error.message}`);
//   }
// }

// // Get the latest journal page
// export async function getLatestJournalPage(userId: string): Promise<any | null> {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         // Query.equal("isDeleted", false),
//         Query.orderDesc("$createdAt"),
//         Query.limit(1),
//       ]
//     );
//     return pages.documents.length > 0 ? pages.documents[0] : null;
//   } catch (error: any) {
//     throw new Error(`Failed to get latest journal page: ${error.message}`);
//   }
// }

// Delete a journal page (soft delete)
// export async function deleteJournalPage(pageId: string): Promise<void> {
//   try {
//     await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       pageId,
//       {
//         isDeleted: true,
//         updatedAt: new Date().toISOString(),
//       }
//     );
//   } catch (error: any) {
//     throw new Error(`Failed to delete journal page: ${error.message}`);
//   }
// }




// import { ID, databases, Query, appwriteConfig } from "@/lib/appwrite/config";

// // Create a new journal page
// export async function createJournalPage(
//   userId: string,
//   pageTitle: string,
//   pageContent: string,
//   isBookmarked: boolean = false
// ): Promise<any> {
//   try {
//     const newPage = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       ID.unique(),
//       {
//         userId,
//         pageTitle,
//         pageContent,
//         isBookmarked,
//         // isDeleted: false,
//       }
//     );
//     return newPage;
//   } catch (error: any) {
//     throw new Error(`Failed to create journal page: ${error.message}`);
//   }
// }

// // Get all journal pages for a user (sorted by creation date)
// export async function getUserJournalPages(userId: string): Promise<any[]> {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         Query.orderDesc("$createdAt")
//       ]
//     );
//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to get journal pages: ${error.message}`);
//   }
// }

// // Get a specific journal page by ID
// export async function getJournalPage(pageId: string): Promise<any> {
//   try {
//     const page = await databases.getDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       pageId
//     );
//     return page;
//   } catch (error: any) {
//     throw new Error(`Failed to get journal page: ${error.message}`);
//   }
// }

// // Update a journal page
// export async function updateJournalPage(
//   pageId: string,
//   updates: {
//     pageTitle?: string;
//     pageContent?: string;
//     isBookmarked?: boolean;
//   }
// ): Promise<any> {
//   try {
//     const updatedPage = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       pageId,
//       {
//         ...updates,
//       }
//     );
//     return updatedPage;
//   } catch (error: any) {
//     throw new Error(`Failed to update journal page: ${error.message}`);
//   }
// }

// // Get bookmarked journal pages
// export async function getBookmarkedPages(userId: string): Promise<any[]> {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         Query.equal("isBookmarked", true),
//         Query.orderDesc("$createdAt")
//       ]
//     );
//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to get bookmarked pages: ${error.message}`);
//   }
// }

// // Search journal pages by pageContent or pageTitle
// export async function searchJournalPages(
//   userId: string,
//   searchQuery: string
// ): Promise<any[]> {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         Query.or([
//           Query.search("pageContent", searchQuery),
//           Query.search("pageTitle", searchQuery),
//         ]),
//       ]
//     );
//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to search journal pages: ${error.message}`);
//   }
// }

// // Get journal pages by date range
// export async function getJournalPagesByDateRange(
//   userId: string,
//   startDate: string,
//   endDate: string
// ): Promise<any[]> {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         Query.greaterThanEqual("$createdAt", startDate),
//         Query.lessThanEqual("$createdAt", endDate),
//         Query.orderDesc("$createdAt"),
//       ]
//     );
//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to get pages by date range: ${error.message}`);
//   }
// }

// // Get the latest journal page
// export async function getLatestJournalPage(userId: string): Promise<any | null> {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         Query.orderDesc("$createdAt"),
//         Query.limit(1),
//       ]
//     );
//     return pages.documents.length > 0 ? pages.documents[0] : null;
//   } catch (error: any) {
//     throw new Error(`Failed to get latest journal page: ${error.message}`);
//   }
// }


// import { ID, databases, Query, appwriteConfig } from "@/lib/appwrite/config";

// // Create a new journal page
// export async function createJournalPage(
//   userId: string,
//   pageTitle: string,
//   pageContent: string,
//   bookmarked: boolean = false
// ): Promise<any> {
//   try {
//     const newPage = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       ID.unique(),
//       {
//         userId,
//         pageTitle,
//         pageContent,
//         bookmarked,
//         // isDeleted: false,
//       }
//     );
//     return newPage;
//   } catch (error: any) {
//     throw new Error(`Failed to create journal page: ${error.message}`);
//   }
// }

// // Get all journal pages for a user (sorted by creation date)
// export async function getUserJournalPages(userId: string): Promise<any[]> {
//   try {
//     const pages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       [
//         Query.equal("userId", userId),
//         Query.orderDesc("$createdAt")
//       ]
//     );
//     return pages.documents;
//   } catch (error: any) {
//     throw new Error(`Failed to get journal pages: ${error.message}`);
//   }
// }

// // Update a journal page
// export async function updateJournalPage(
//   pageId: string,
//   updates: {
//     pageTitle?: string;
//     pageContent?: string;
//     isBookmarked?: boolean;
//   }
// ): Promise<any> {
//   try {
//     const updatedPage = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.journalsCollectionId,
//       pageId,
//       {
//         ...updates
//       }
//     );
//     return updatedPage;
//   } catch (error: any) {
//     throw new Error(`Failed to update journal page: ${error.message}`);
//   }
// }


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
        pageNumber, // Add pageNumber to document
        // isDeleted: false,
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