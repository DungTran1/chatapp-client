import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Messages, Reaction, Room } from "../../shared/type";

import {
  CheckUserJoinLink,
  getListUserReaction,
  getMessages,
  getRooms,
  getSearchUserResult,
} from "../api";
import { get } from "../axiosConfig";

export const useRoomQuery = (userId: string | undefined) => {
  const query = useQuery<Room[], Error>(["room"], () => getRooms(userId), {
    staleTime: Infinity,
    enabled: !!userId,
  });

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
      // refetchOnMount: true,
      refetchOnReconnect: "always",
    }
  );
  return query;
};
export const useCurrentRoomQuery = (roomId: string | undefined) => {
  const query = useQuery<Room, Error>(
    ["currentRoom"],
    () => get("auth/getCurrentRoom/" + roomId),
    {
      // staleTime: Infinity,
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
export const useUserJoinLink = (
  roomId: string | undefined,
  userId: string | undefined
) => {
  const query = useQuery(
    ["userJoinLink", roomId, userId],
    () => CheckUserJoinLink(roomId, userId),
    {
      staleTime: Infinity,
      //  refetchInterval: 3000
    }
  );
  return query;
};
