// Types shared across the app

export interface User {
  _id: string;
  fullname: string;
  email: string;
  bio: string;
  profilePic: string;
  nativeLanguage: string;
  learningLanguage: string;
  location: string;
  isOnboarded: boolean;
  onBoarding: boolean;
  friends: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequest {
  _id: string;
  sender: User;
  recipient: User | string;
  status: 'pending' | 'accepted';
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequestsResponse {
  incommingReq: FriendRequest[];
  acceptedReq: FriendRequest[];
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface StreamTokenResponse {
  token: string;
}
