export type UsersTyping = {
  status: boolean;
  user: User;
  roomId: string;
};

export type Chat = {
  chatNotificationSound: HTMLAudioElement;
  usersTyping: UsersTyping[];
  userOnline: string[];
  formPopUp:
    | "AddUserToGroupChat"
    | "CreateGroupChat"
    | "ChangeNickName"
    | "ChangeRoomName"
    | "WatchMediaFile"
    | null;
  replyMessage: Message | null;
};
export type User = {
  _id: string;
  email: string;
  displayName: string;
  photoURL: string;
};
export type Messages = {
  page: number;
  messages: Message[];
  total_results: number;
};

export type UserInRoom = {
  user: User;
  nickname: string;
};
export type Reaction = {
  user: User;
  name: string;
};
export type Message = {
  _id: string;
  roomId: string;
  text: string;
  reply: Message;
  type: "Notification" | "Sending" | "Revocation";
  files: string[];
  reaction: Reaction[];
  actedByUser: User | null;
  createdAt: Date;
};

export type Room = {
  _id: string;
  type: "Group" | "Private";
  isAcceptLink: boolean;
  name: string;
  initiator: string;
  photoURL: string;
  users: UserInRoom[];
  lastMessage: Message;
};
export type Media = {
  files: string[];
};
