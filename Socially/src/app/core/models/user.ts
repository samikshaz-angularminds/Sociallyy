import { IPost } from "./post"

export interface IUser {
  id: string,
  username: string,
  email: string,
  password: string,
  full_name: string,
  profileImage: UserProfilePhoto,
  bio: string,
  phone: string,
  website: string,
  isVerified: boolean,
  isPrivate: boolean,
  followers: followerFollowing[],
  followings: followerFollowing[],
  posts: IPost[],
  _id: string,
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
  url: string
  _id: string
}

export interface IUserLogin {
  _id: string
  email: string
  password: string
}