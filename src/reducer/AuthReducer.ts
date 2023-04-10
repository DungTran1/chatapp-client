import { createSlice } from "@reduxjs/toolkit";
import { User } from "../shared/type";

interface Auth {
  user: User | null;
}
const initialState: Auth = {
  user: null,
};

const AuthReduceSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    getSignIn: (state: Auth, action) => {
      state.user = {
        _id: action.payload.uid,
        email: action.payload.email,
        displayName: action.payload.displayName,
        photoURL: action.payload.photoURL || "",
      };
    },
    signOutCur: (state) => {
      state.user = null;
    },
    updateDisplayName: (state, action) => {
      (state.user as User).displayName = action.payload;
    },
    updateAvatar: (state, action) => {
      (state.user as User).photoURL = action.payload;
    },
  },
});
const { reducer, actions } = AuthReduceSlice;
export const { getSignIn, signOutCur, updateDisplayName, updateAvatar } =
  actions;
export default reducer;
