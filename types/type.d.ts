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
  topic: string;
  songId?: number;
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

declare interface Song {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  isrc: string;
  link: string;
  share: string;
  duration: number;
  track_position: number;
  disk_number: number;
  rank: number;
  release_date: string;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  bpm: number;
  gain: number;
  available_countries: string[];
  contributors: Contributor[];
  md5_image: string;
  track_token: string;
  artist: Artist;
  album: Album;
  type: string;
}

declare interface Contributor {
  id: number;
  name: string;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  radio: boolean;
  tracklist: string;
  type: string;
  role: string;
}

declare interface Artist {
  id: number;
  name: string;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  radio: boolean;
  tracklist: string;
  type: string;
}

declare interface Album {
  id: number;
  title: string;
  link: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  release_date: string;
  tracklist: string;
  type: string;
}