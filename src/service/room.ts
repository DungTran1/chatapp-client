import {
  Media,
  Message,
  Messages,
  Reaction,
  Room,
  User,
  UserInRoom,
  Users,
} from "../shared/type";
import { get, post } from "./axiosConfig";

export const getAllUserAbleAdd: (
  usersInCurrentRoom: UserInRoom[] | undefined,
  page: number,
  currentUser: User | null
) => Promise<Users> = async (usersInCurrentRoom, page, currentUser) => {
  let res;
  if (usersInCurrentRoom?.length) {
    const users = usersInCurrentRoom.map((e) => e.user._id);
    res = await get(
      `auth/getUsersToRoom/${page}?usersInCurrentRoom=${JSON.stringify(users)}`
    );
  } else {
    res = await get(`auth/getUsers/${page}?currentUserId=${currentUser?._id}`);
  }
  const { users, total_results } = res;
  return {
    page: page,
    users,
    total_results,
  };
};
export const getRooms: (userId: string | undefined) => Promise<Room[]> = async (
  userId
) => {
  const res: { room: Room[] } = await get("auth/getRooms/" + userId);
  return res.room;
};
export const CheckUserJoinLink = async (
  roomId: string,
  userId: string | undefined
) => {
  const res: { userExist: boolean; isAcceptLink: boolean } = await get(
    `auth/isAcceptLink?userId=${userId}&roomId=${roomId}`
  );
  return { userExist: res.userExist, isAcceptLink: res.isAcceptLink };
};
export const getMessages: (
  page: number,
  roomId: string | undefined,
  skipWhileNewMessage: number
) => Promise<Messages> = async (page, roomId, skipWhileNewMessage) => {
  const res = await get(
    `auth/getMessage/${roomId}?page=${page}&skipWhileNewMessage=${skipWhileNewMessage}`
  ).catch((error) => console.log(error));

  const { messages, total_results } = res;
  return {
    page: page,
    messages,
    total_results,
  };
};
export const getSearchRoomResult: (value: string) => Promise<Room[]> = async (
  value
) => {
  const res = await get(`auth/searchRoom?searchValue=${value}`);
  const { search }: { search: Room[] } = res;
  return search;
};
export const updateAllowJoinInLink = async (
  roomId: string,
  isAccept: boolean
) => {
  const res = await post("auth/updateAcceptLink", {
    roomId,
    isAccept,
  });
};
export const getSearchUserResult: (
  value: string,
  userSkip: string[]
) => Promise<User[]> = async (value, userSkip) => {
  const res = await get(
    `auth/searchUser?searchValue=${value}&userSkip=${JSON.stringify(userSkip)}`
  ).catch((error) => console.log(error));
  const { search }: { search: User[] } = res;
  return search;
};
export const getListUserReaction: (
  roomId: string | undefined,
  messageId: string
) => Promise<Reaction[]> = async (roomId, messageId) => {
  const res: { reaction: Reaction[] } = await get(
    `auth/getListUserReaction/${roomId}?messageId=${messageId}`
  );
  return res.reaction;
};
export const getMedia: (roomId: string | undefined) => Promise<Media> = async (
  roomId
) => {
  const res: { files: string[] } = await get(`auth/getMedia/${roomId}`);
  return { files: res.files };
};
