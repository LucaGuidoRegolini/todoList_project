import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./feature/userSlice";

const persistedState = localStorage.getItem("reduxState");

const rootReducer = combineReducers({
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState ? JSON.parse(persistedState) : undefined,
});

store.subscribe(() => {
  localStorage.setItem("reduxState", JSON.stringify(store.getState()));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
