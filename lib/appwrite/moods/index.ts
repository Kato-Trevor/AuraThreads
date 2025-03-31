import { ID, databases, appwriteConfig, Query } from "@/lib/appwrite/config";

export interface MoodLog {
  mood: "sad" | "angry" | "neutral" | "happy" | "excited";
  reason: string;
  userId: string;
}

export const getMoodLogs = async (userId: string) => {
  try {
    const moodLogs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.moodsCollectionId,
      [Query.equal("user", userId)]
    );

    return moodLogs.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createMoodLog = async (logData: MoodLog) => {
  try {
    const newMoodLog = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.moodsCollectionId,
      ID.unique(),
      {
        mood: logData.mood,
        reason: logData.reason,
        user: logData.userId,
      }
    );

    return newMoodLog;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteMoodLog = async (moodLogId: string) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.moodsCollectionId,
      moodLogId
    );
  } catch (error: any) {
    throw new Error(error);
  }
};
