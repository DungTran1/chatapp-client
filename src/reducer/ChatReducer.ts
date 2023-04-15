import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Chat,
  Message,
  Notification,
  Room,
  User,
  UserInRoom,
  UsersTyping,
} from "../shared/type";

const initialState: Chat = {
  chatNotificationSound: new Audio(
    require("../assets/sound/sounds_message.wav")
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
