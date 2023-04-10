import { useQueryClient } from "@tanstack/react-query";
import { Room } from "../../shared/type";

export const useQuerySelector = () => {
  const queryClient = useQueryClient();
  const currentRoom = queryClient.getQueryData<Room>(["currentRoom"]);

  return {
    currentRoom,
  };
};
