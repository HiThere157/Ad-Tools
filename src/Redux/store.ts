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
  createMigrate,
} from "redux-persist";

import { migrations } from "./migrations";
import preferencesReducer from "./preferencesSlice";
import tabsReducer from "./tabsSlice";
import dataReducer from "./dataSlice";
import environmentReducer from "./environmentSlice";
import tetrisReducer from "./tetrisSlice";

const persistConfig = {
  key: "root",
  version: 0,
  storage,
  whitelist: ["preferences", "tetris"],
  migrate: createMigrate(migrations),
};
const reducer = persistCombineReducers(persistConfig, {
  preferences: preferencesReducer,
  tabs: tabsReducer,
  data: dataReducer,
  environment: environmentReducer,
  tetris: tetrisReducer,
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
