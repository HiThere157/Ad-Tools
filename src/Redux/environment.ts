import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const environmentSlice = createSlice({
  name: "environment",
  initialState: {
    electron: {
      executingUser: "",
      appVersion: "",
      appChannel: "stable",
    },
    powershell: {
      adVersion: null as string | null,
      azureAdVersion: null as string | null,
    },
    azure: {
      executingAzureUser: "",
    },
    updateStatus: null as null | UpdateDownloadStatus,
  },
  reducers: {
    setElectronEnvironment: (state, action: PayloadAction<ElectronEnvironment>) => {
      state.electron = action.payload;
    },
    setAzureEnvironment: (state, action: PayloadAction<AzureEnvironment>) => {
      state.azure = action.payload;
    },
    setPowershellEnvironment: (state, action: PayloadAction<PowershellEnvironment>) => {
      state.powershell = action.payload;
    },
    setUpdateDownloadStatus: (state, action: PayloadAction<UpdateDownloadStatus>) => {
      state.updateStatus = action.payload;
    },
  },
});

export const {
  setElectronEnvironment,
  setAzureEnvironment,
  setPowershellEnvironment,
  setUpdateDownloadStatus,
} = environmentSlice.actions;
export default environmentSlice.reducer;
