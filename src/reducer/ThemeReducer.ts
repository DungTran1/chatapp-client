import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: localStorage.getItem("theme") === "dark" ? true : false,
  },
  reducers: {
    changeTheme: (state) => {
      state.theme = !state.theme;
    },
  },
});
const { reducer, actions } = themeSlice;
export const { changeTheme } = actions;
export default reducer;
