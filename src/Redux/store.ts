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

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["preferences"],
  migrate: createMigrate(migrations),
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
