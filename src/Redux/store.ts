import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistCombineReducers,
} from "redux-persist";

import preferencesReducer from "./preferences";
import tabsReducer from "./tabs";
import dataReducer from "./data";
import environmentReducer from "./environment";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["preferences"],
};
const reducer = persistCombineReducers(persistConfig, {
  preferences: preferencesReducer,
  tabs: tabsReducer,
  data: dataReducer,
  environment: environmentReducer,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
