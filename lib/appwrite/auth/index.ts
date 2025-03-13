import {
  ID,
  account,
  Query,
  avatars,
  databases,
  appwriteConfig,
} from "@/lib/appwrite/config";

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    console.log('fetched account is', currentAccount);
    return currentAccount;
  } catch (error: any) {
    throw new Error(error);
  }
}

export const createUser = async (data: UserModel) => {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        username: data.username,
        email: data.email,
        role: data.role,
      }
    );

    return newUser;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    console.log("currentAccount is here", currentAccount);
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    
    console.log("currentUser is here", currentUser);
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
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
