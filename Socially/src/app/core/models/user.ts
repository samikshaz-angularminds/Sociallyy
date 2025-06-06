import { IPost } from "./post"

export interface IUser {
  id: string,
  username: string,
  email: string,
  password: string,
  full_name: string,
  profileImage: UserProfilePhoto | undefined,
  bio: string,
  phone: string,
  website: string,
  isVerified: boolean,
  isPrivate: boolean,
  followers: followerFollowing[],
  followings: followerFollowing[],
  posts: IPost[],
  _id: string,
  refreshToken: string,
  createdAt: string,
  updatedAt: string,
}

export interface followerFollowing {
  username: string,
  full_name: string,
  profilePic: UserProfilePhoto
}

export interface UserProfilePhoto {
  public_id: string
  url: string | undefined
  _id: string
}

export interface IUserLogin {
  _id: string
  email: string
  password: string
}