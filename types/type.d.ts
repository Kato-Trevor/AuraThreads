declare interface UserModel {
  id?: string;
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