import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Message, Messages, Reaction, Room, User } from "../../shared/type";

export const useActionQuery = () => {
  const queryClient = useQueryClient();
  const CreateRoom = (user: User, room: Room) => {
    return queryClient.setQueryData(
      ["room", user?._id],
      (oldData: Room[] | undefined) => {
        if (!oldData) return undefined;
        return [...oldData, room];
      }
    );
  };
  const UpdateCurrentRoom = (data: Room) => {
    queryClient.setQueryData(["currentRoom"], (oldData: Room | undefined) => ({
      ...oldData,
      ...data,
    }));
  };
  const UpdateLastMessage = (lastMessage: Message) => {
    return queryClient.setQueryData(["room"], (oldData: Room[] | undefined) => {
      return oldData?.map((e) =>
        e._id === lastMessage.roomId
          ? {
              ...e,
              lastMessage: {
                ...e.lastMessage,
                ...lastMessage,
              },
            }
          : e
      );
    });
  };
  const AddMessage = (newMessage: Message) => {
    return queryClient.setQueryData(
      ["messages", newMessage.roomId],
      (oldData: InfiniteData<Messages> | undefined) => {
        return oldData
          ? {
              ...oldData,
              pages: oldData?.pages?.map((page, index: number) => {
                return index === 0
                  ? {
                      ...page,
                      messages: [newMessage, ...page.messages],
                    }
                  : page;
              }),
            }
          : undefined;
      }
    );
  };
  const RevokeMessage = (roomId: string, messageId: string) => {
    return queryClient.setQueryData(
      ["messages", roomId],
      (oldData: InfiniteData<Messages> | undefined) => {
        return oldData
          ? {
              ...oldData,
              pages: oldData?.pages?.map((page) => {
                return {
                  ...page,
                  messages: page.messages.map((mess) => {
                    let newMess = mess;
                    if (mess._id === messageId) {
                      newMess = { ...mess, type: "Revocation" };
                      return newMess;
                    }
                    return mess;
                  }),
                };
              }),
            }
          : undefined;
      }
    );
  };
  const resetRoom = (userId: string) => {
    queryClient.invalidateQueries(["room"]);
    queryClient.invalidateQueries(["currentRoom"]);
  };
  const UpdateReaction = (messageId: string, user: User, name: string) => {
    queryClient.setQueryData(
      ["list-reaction", messageId],
      (oldData: Reaction[] | undefined) => {
        if (!oldData) return;
        const indexReaction = oldData?.find((e) => e.user._id === user._id);
        if (indexReaction) {
          if (indexReaction.name === name) {
            return oldData;
          } else {
            return oldData.map((e) =>
              e.user._id === user._id ? { ...e, name } : e
            );
          }
        }
        return [
          ...oldData,
          {
            user: user,
            name,
          },
        ];
      }
    );
  };
  return {
    UpdateCurrentRoom,
    CreateRoom,
    UpdateLastMessage,
    AddMessage,
    RevokeMessage,
    UpdateReaction,
    resetRoom,
  };
};
