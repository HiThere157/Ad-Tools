import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const environmentSlice = createSlice({
  name: "environment",
  initialState: {
    executingUser: "",
    appVersion: "",
    appChannel: "stable",
  },
  reducers: {
    setEnvironment: (state, action: PayloadAction<ElectronEnvironment>) => {
      const { executingUser, appVersion, appChannel } = action.payload;

      state.executingUser = executingUser;
      state.appVersion = appVersion;
      state.appChannel = appChannel;
    },
  },
});

export const { setEnvironment } = environmentSlice.actions;
export default environmentSlice.reducer;
