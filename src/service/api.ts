import { Media, Messages, Reaction, Room, User } from "../shared/type";
import { get, post } from "./axiosConfig";

export const signIn = async (userId: string) => {
  try {
    const res: User = await post("auth/signin", {
      _id: userId,
    });
    return res;
  } catch (error) {
    return null;
  }
};
export const getRooms = async (userId: string | undefined) => {
  try {
    if (!userId) return [];
    const res: { room: Room[] } = await get("auth/getRooms/" + userId);
    return res.room;
  } catch (error) {
    return [];
  }
};
export const CheckUserJoinLink = async (
  roomId: string,
  userId: string | undefined
) => {
  try {
    const res: { userExist: boolean; isAcceptLink: boolean } = await get(
      `auth/isAcceptLink?userId=${userId}&roomId=${roomId}`
    );
    return { userExist: res.userExist, isAcceptLink: res.isAcceptLink };
  } catch (error) {}
};
export const getMessages: (
  page: number,
  roomId: string | undefined,
  skipWhileNewMessage: number
) => Promise<Messages> = async (page, roomId, skipWhileNewMessage) => {
  try {
    const res = await get(
      `auth/getMessage/${roomId}?page=${page}&skipWhileNewMessage=${skipWhileNewMessage}`
    );

    const { messages, total_results } = res;
    return {
      page: page,
      messages,
      total_results,
    };
  } catch (error) {
    return { page: 0, messages: [], total_results: 0 };
  }
};
export const getSearchRoomResult: (value: string) => Promise<Room[]> = async (
  value
) => {
  try {
    const res = await get(`auth/searchRoom?searchValue=${value}`);
    const { search }: { search: Room[] } = res;
    return search;
  } catch (error) {
    return [];
  }
};
export const updateAllowJoinInLink = async (
  roomId: string,
  isAccept: boolean
) => {
  try {
    await post("auth/updateAcceptLink", {
      roomId,
      isAccept,
    });
  } catch (error) {}
};
export const getSearchUserResult: (
  value: string,
  userSkip: string[]
) => Promise<User[]> = async (value, userSkip) => {
  try {
    const res = await get(
      `auth/searchUser?searchValue=${value}&userSkip=${JSON.stringify(
        userSkip
      )}`
    );
    const { search }: { search: User[] } = res;
    return search;
  } catch (error) {
    return [];
  }
};
export const getListUserReaction: (
  roomId: string | undefined,
  messageId: string
) => Promise<Reaction[]> = async (roomId, messageId) => {
  try {
    const res: { reaction: Reaction[] } = await get(
      `auth/getListUserReaction/${roomId}?messageId=${messageId}`
    );
    return res.reaction;
  } catch (error) {
    return [];
  }
};
export const getMedia: (roomId: string | undefined) => Promise<Media> = async (
  roomId
) => {
  try {
    const res: { files: string[] } = await get(`auth/getMedia/${roomId}`);
    return { files: res.files };
  } catch (error) {
    return { files: [] };
  }
};
