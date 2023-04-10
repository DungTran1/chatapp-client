import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, Room, User, UserInRoom } from "../shared/type";
interface UsersTyping {
  status: boolean;
  user: User;
  roomId: string;
}
interface Notification {
  roomId?: string;
  userId?: string;
  quantum: number;
}

interface Chat {
  chatNotificationSound: HTMLAudioElement;
  isNotificationSound: boolean;
  isNewMessage: boolean;
  isFullViewMedia: boolean;
  isDetailReaction: boolean;
  notification: Notification[];
  usersTyping: UsersTyping[];
  userOnline: string[];
  // currentRoom: Room | null;
  formPopUp:
    | "AddUserToGroupChat"
    | "CreateGroupChat"
    | "ChangeNickName"
    | "ChangeRoomName"
    | "WatchMediaFile"
    | null;
  replyMessage: Message | null;
}
const initialState: Chat = {
  chatNotificationSound: new Audio(
    require("../assets/sound/mixkit-water-bubble-1317.wav")
  ),
  isNotificationSound: false,
  isNewMessage: false,
  isFullViewMedia: false,
  isDetailReaction: false,
  notification: [],
  usersTyping: [],
  formPopUp: null,
  userOnline: [],
  // currentRoom: null,
  replyMessage: null,
};

const AuthReduceSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    getUserOnline: (state, action: PayloadAction<string[]>) => {
      state.userOnline = action.payload;
    },
    setNotification: (state, action: PayloadAction<Notification[]>) => {
      state.notification = action.payload;
    },
    updateUsersTyping: (state, action: PayloadAction<UsersTyping>) => {
      if (action.payload.status) {
        if (
          !state.usersTyping.some(
            (user) => user.user._id === action.payload.user._id
          )
        ) {
          state.usersTyping = [action.payload, ...state.usersTyping];
        }
      } else {
        state.usersTyping = state.usersTyping.filter(
          (user) => user.user._id !== action.payload.user._id
        );
      }
    },
    updateNotification: (state, action) => {
      state.notification = action.payload;
    },
    setFormPopUp: (
      state,
      action: PayloadAction<
        | "AddUserToGroupChat"
        | "CreateGroupChat"
        | "ChangeNickName"
        | "ChangeRoomName"
        | "WatchMediaFile"
        | null
      >
    ) => {
      state.formPopUp = action.payload;
    },

    setReplyMessage: (state, action: PayloadAction<Message | null>) => {
      state.replyMessage = action.payload;
    },
  },
});
const { reducer, actions } = AuthReduceSlice;
export const {
  getUserOnline,
  setNotification,
  updateUsersTyping,
  updateNotification,
  setFormPopUp,
  setReplyMessage,
} = actions;
export default reducer;
