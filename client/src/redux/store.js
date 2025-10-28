import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { fsApi } from "./api";
import groupReducer from "./groupSlice";

export const store = configureStore({
  reducer: {
    group: groupReducer,
    [fsApi.reducerPath]: fsApi.reducer,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fsApi.middleware),
});

setupListeners(store.dispatch);
