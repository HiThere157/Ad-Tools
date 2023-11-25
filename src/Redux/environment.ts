import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const environmentSlice = createSlice({
  name: "environment",
  initialState: {
    executingUser: "",
    executingAzureUser: "",
    appVersion: "",
    appChannel: "stable",
  },
  reducers: {
    setElectronEnvironment: (state, action: PayloadAction<ElectronEnvironment>) => {
      const { executingUser, appVersion, appChannel } = action.payload;

      state.executingUser = executingUser;
      state.appVersion = appVersion;
      state.appChannel = appChannel;
    },
    setAzureEnvironment: (state, action: PayloadAction<AzureEnvironment>) => {
      const { executingAzureUser } = action.payload;

      state.executingAzureUser = executingAzureUser;
    },
  },
});

export const { setElectronEnvironment, setAzureEnvironment } = environmentSlice.actions;
export default environmentSlice.reducer;
