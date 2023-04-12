import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Message, Messages, Reaction, Room } from "../../shared/type";
import { useAppSelector } from "../../store/hook";
import {
  CheckUserJoinLink,
  getListUserReaction,
  getMessages,
  getRooms,
  getSearchUserResult,
} from "../api";
import { get } from "../axiosConfig";

export const useRoomQuery = (userId: string | undefined) => {
  const query = useQuery<Room[], Error>(
    ["room", userId],
    () => getRooms(userId),
    {
      // refetchInterval: 2000,
      refetchOnWindowFocus: false,
    }
  );

  return query;
};
export const useSearchUser = (value: string, userSkip: string[]) => {
  const query = useQuery(
    ["search", value],
    () => getSearchUserResult(value, userSkip),
    { initialData: [], refetchOnWindowFocus: false }
  );
  return query;
};
export const useInfiniteMessageQuery = (
  roomId: string | undefined,
  skip: number
) => {
  const query = useInfiniteQuery<Messages, Error>(
    ["messages", roomId],
    ({ pageParam = 1 }) => {
      return getMessages(pageParam, roomId, skip);
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.page <= lastPage.total_results
          ? lastPage.page + 1
          : undefined;
      },
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );
  return query;
};
export const useCurrentRoomQuery = () => {
  const query = useQuery<Room, Error>(
    ["currentRoom"],
    () => get("auth/getCurrentRoom/" + localStorage.getItem("currentRoom")),
    {
      // refetchInterval: 2000,
    }
  );
  return query;
};
export const useReactionQuery = (roomId: string, messageId: string) => {
  const query = useQuery<Reaction[], Promise<Reaction[]>>(
    ["list-reaction", messageId],
    () => getListUserReaction(roomId, messageId),
    {
      refetchOnWindowFocus: false,
    }
  );
  return query;
};
export const useUserJoinLink = (roomId: string) => {
  const user = useAppSelector((state) => state.auth.user);
  const query = useQuery(
    ["userJoinLink", roomId],
    () => CheckUserJoinLink(roomId, user?._id),
    {
      staleTime: Infinity,
      //  refetchInterval: 3000
    }
  );
  return query;
};
