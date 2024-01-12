/* eslint-disable  @typescript-eslint/no-non-null-assertion */

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { defaultGlobalTablePreferences } from "../Config/default";

type SetTablePreferencesAction = {
  page: string;
  name: string;
  preferences: TablePreferences;
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    isNavBarExpanded: true,
    zoom: 1,
    tablePreferences: defaultGlobalTablePreferences,
    queryDomains: [] as string[],
    azureLoginUPN: "",
  },
  reducers: {
    toggleNavBar: (state) => {
      state.isNavBarExpanded = !state.isNavBarExpanded;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setTablePreferences: (state, action: PayloadAction<SetTablePreferencesAction>) => {
      const { page, name, preferences } = action.payload;

      if (!state.tablePreferences[page]) {
        state.tablePreferences[page] = {};
      }

      state.tablePreferences[page]![name] = preferences;
    },
    setAzureLoginUPN: (state, action: PayloadAction<string>) => {
      state.azureLoginUPN = action.payload;
    },
    setDefaultQueryDomains: (state, action: PayloadAction<string[]>) => {
      if (state.queryDomains.length === 0) {
        state.queryDomains = action.payload;
      }
    },
    setQueryDomains: (state, action: PayloadAction<string[]>) => {
      state.queryDomains = action.payload;
    },
  },
});

export const {
  toggleNavBar,
  setZoom,
  setTablePreferences,
  setAzureLoginUPN,
  setDefaultQueryDomains,
  setQueryDomains,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
