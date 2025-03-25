declare module 'react-tagcloud/rn';
declare interface UserModel {
  $id?: string;
  anonymousId? : string;
  email: string;
  password: string;
  username: string;
  gender?: string;
  lastName?: string;
  firstName?: string;
  phoneNumber?: string;
  identificationNumber?: string;
  affiliation?: string;
  role: string;
}

declare interface PostModel {
  $id?: string;
  userId: UserModel;
  content: string;
  $createdAt?: string;
  updatedAt?: string;
}

declare interface ResponseModel {
  $id?: string;
  userId: UserModel;
  postId: PostModel;
  content: string;
  $createdAt?: string;
  updatedAt?: string;
}

declare interface ReactionModel {
  $id?: string;
  madeBy: UserModel;
  reactedTo: ResponseModel;
  reactionType: "like" | "dislike";
  $createdAt?: string;
  updatedAt?: string;
}