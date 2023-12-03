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
      adVersion: "",
      azureAdVersion: "",
    },
    azure: {
      executingAzureUser: "",
    },
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
  },
});

export const { setElectronEnvironment, setAzureEnvironment, setPowershellEnvironment } =
  environmentSlice.actions;
export default environmentSlice.reducer;
