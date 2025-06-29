import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { fsApi } from "./api";
import groupReducer from "./groupStore";

export const store = configureStore({
  reducer: {
    [fsApi.reducerPath]: fsApi.reducer,
    group: groupReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fsApi.middleware),
});

setupListeners(store.dispatch);
