import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    darkTheme: localStorage.getItem("theme") === "dark" ? true : false,
  },
  reducers: {
    changeTheme: (state) => {
      state.darkTheme = !state.darkTheme;
    },
  },
});
const { reducer, actions } = themeSlice;
export const { changeTheme } = actions;
export default reducer;
