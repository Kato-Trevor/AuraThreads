import {
  ID,
  account,
  Query,
  databases,
  appwriteConfig,
  storage,
} from "@/lib/appwrite/config";
import { ImagePickerAsset } from "expo-image-picker";

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    console.log("fetched account is", currentAccount);
    return currentAccount;
  } catch (error: any) {
    throw new Error(error);
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createUser = async (data: UserModel) => {
  const { email, password, username, role, ...additionalFields } = data;
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error();

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        role,
        ...additionalFields,
      }
    );

    return newUser;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUsersByRole = async (role: string) => {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("role", role), Query.orderDesc("$createdAt")]
    );

    return users.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    return response;
  } catch (error: any) {
    throw new Error(error.message || "An error occurred during user deletion");
  }
};

export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function uploadFile(file: ImagePickerAsset) {
  if (!file) return;

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      await prepareNativeFile(file),
    );
    const fileUrl = await getFileUrl(uploadedFile.$id);
    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
}

const prepareNativeFile = async (
  asset: ImagePickerAsset
): Promise<{ name: string; type: string; size: number; uri: string }> => {
  console.log("[prepareNativeFile] asset ==>", asset);
  try {
    const url = new URL(asset.uri);

    // Handle native file preparation
    return {
      name: url.pathname.split("/").pop()!,
      size: asset.fileSize!,
      type: asset.mimeType!,
      uri: url.href,
    } as any;
  } catch (error) {
    console.error("[prepareNativeFile] error ==>", error);
    return Promise.reject(error);
  }
};

export async function getFileUrl(fileId: string) {
  let fileUrl;

  try {
    fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
}
