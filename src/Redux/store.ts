import { configureStore } from "@reduxjs/toolkit";

import preferencesReducer from "./preferences";

const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;