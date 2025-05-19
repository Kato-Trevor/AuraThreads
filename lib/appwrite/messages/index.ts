import { ID, databases, appwriteConfig, Query } from "@/lib/appwrite/config";

export async function getMessagesByUserID(userId: string) {
  try {
    const messages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.equal("userId", userId)]
    );

    return messages.documents.length > 0 ? messages.documents : [];
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getMessagesByUserIDAndReceiverID(
  userId: string,
  receiverId: string
) {
  try {
    const messages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [
        Query.or([
          Query.and([Query.equal("userId", userId)]),
          Query.and([Query.equal("receiverId", receiverId)]),
        ]),
      ]
    );

    return messages.documents.length > 0 ? messages.documents : [];
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function addMessageToDB(
  messageContent: string,
  userId: string,
  receiverId: string
) {
  try {
    const newMessage = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        content: messageContent,
        userId,
        receiverId,
      }
    );

    return newMessage;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deleteMessageFromDB(messageId: string) {
  try {
    const deletedMessage = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      messageId
    );

    return deletedMessage;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateMessageInDB(
  messageId: string,
  messageContent: string
) {
  try {
    const updatedMessage = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      messageId,
      {
        content: messageContent,
      }
    );

    return updatedMessage;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getMessageFromDB(messageId: string) {
  try {
    const message = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      messageId
    );

    return message;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getMessagesByReceiverID(receiverId: string) {
  try {
    const messages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.equal("receiverId", receiverId)]
    );

    return messages.documents.length > 0 ? messages.documents : [];
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getAllMessagesFromDB() {
  try {
    const messages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return messages.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}
