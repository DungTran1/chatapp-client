import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducer/AuthReducer";
import themeReducer from "../reducer/ThemeReducer";
import chatReducer from "../reducer/ChatReducer";
const store = configureStore({
  reducer: { auth: authReducer, theme: themeReducer, chat: chatReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
