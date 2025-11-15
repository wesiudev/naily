import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import ctaReducer from "./slices/cta";
export const store = configureStore({
  reducer: {
    user: userReducer,
    cta: ctaReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
