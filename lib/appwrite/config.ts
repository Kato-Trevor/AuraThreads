import {
  ID,
  Query,
  Client,
  Account,
  Avatars,
  Storage,
  Databases,
  OAuthProvider,
  AppwriteException,
} from "react-native-appwrite";
export { ID, Query, AppwriteException, OAuthProvider };

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.app.aurathreads",
  storageId: "67cffd920002d831fcb9",
  projectId: "67ceecef002fbe95cc82",
  databaseId: "67cef390003a01484712",
  userCollectionId: "67cef3d900318851b813",
  postCollectionId: "67cef75e000f65a9714b",
  responsesCollectionId: "67cef94300024a0db8ef",
  moodsCollectionId: "67cef98a00360b795eb3",
  reactionsCollectionId: "67da7da70000bd42f55d",
  journalsCollectionId: "67f968be001277e36b11",
  bookmarksCollectionId: "6809f4db00316d909513"
};

export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
