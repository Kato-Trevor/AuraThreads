import {
  ID,
  Query,
  avatars,
  databases,
  appwriteConfig,
} from "@/lib/appwrite/config";

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
    throw new Error(error.message || "An error occurred during user creation");
  }
};

export const updateUser = async (userId: string, data: UserModel) => {
  try {
    const avatarUrl = data.name
      ? avatars.getInitials(data.name)
      : avatars.getInitials(`${data.firstName} ${data.lastName}`);

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        name: data.name ? data.name : `${data.firstName} ${data.lastName}`,
        email: data.email,
        avatar: avatarUrl,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        dob: data.dob,
      }
    );

    return updatedUser;
  } catch (error: any) {
    throw new Error(error.message || "An error occurred during user update");
  }
};

export const getUser = async (email: string) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("email", email)]
    );

    return response.documents[0];
  } catch (error: any) {
    throw new Error(error.message || "An error occurred during user retrieval");
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
