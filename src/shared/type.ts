export interface User {
  _id: string;
  email: string;
  displayName: string | null;
  photoURL?: string;
}
export interface Users {
  page: number;
  users: User[];
  total_results: number;
}
export interface Messages {
  page: number;
  messages: Message[];
  total_results: number;
}

export interface UserInRoom {
  user: User;
  nickname: string;
}
export interface Reaction {
  user: User;
  name: string;
}
export interface Message {
  _id: string;
  roomId: string;
  text: string;
  reply: Message;
  type: "Notification" | "Sending" | "Revocation";
  files: string[];
  reaction: Reaction[];
  actedByUser: User | null;
  createdAt: Date;
}

export interface Room {
  _id: string;
  type: "Group" | "Private";
  isAcceptLink: boolean;
  name: string;
  initiator: string;
  photoURL: string;
  users: UserInRoom[];
  lastMessage: Message;
}
export interface Media {
  files: string[];
}
