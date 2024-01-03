/* eslint-disable  @typescript-eslint/no-non-null-assertion */

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SetQueryAction = {
  page: string;
  tabId: number;
  query: Query;
};
type SetResultAction = {
  page: string;
  tabId: number;
  name: string;
  result: ResultDataSet;
};
type SetTableConfigAction = {
  page: string;
  tabId: number;
  name: string;
  config: TableConfig;
};
type RemoveTabDataAction = {
  page: string;
  tabId: number;
};

const dataSlice = createSlice({
  name: "data",
  initialState: {
    query: {} as TabStorage<Query>,
    results: {} as TabStorage<PartialRecord<string, ResultDataSet>>,
    tableConfigs: {} as TabStorage<PartialRecord<string, TableConfig>>,
  },
  reducers: {
    setQuery: (state, action: PayloadAction<SetQueryAction>) => {
      const { page, tabId, query } = action.payload;

      // If the page doesn't exist, create it
      if (!state.query[page]) {
        state.query[page] = {};
      }

      state.query[page]![tabId] = query;
    },
    setResult: (state, action: PayloadAction<SetResultAction>) => {
      const { page, tabId, name, result } = action.payload;

      // If the page or tab doesn't exist, create it
      if (!state.results[page]) {
        state.results[page] = {};
      }
      if (!state.results[page]?.[tabId]) {
        state.results[page]![tabId] = {};
      }

      state.results[page]![tabId]![name] = result;

      // Soft-Reset the config if it exists
      const config = state.tableConfigs[page]?.[tabId]?.[name];
      if (config) {
        config.selected = [];
        config.pageIndex = 0;

        state.tableConfigs[page]![tabId]![name] = config;
      }
    },
    setTableConfig: (state, action: PayloadAction<SetTableConfigAction>) => {
      const { page, tabId, name, config } = action.payload;

      // If the page or tab doesn't exist, create it
      if (!state.tableConfigs[page]) {
        state.tableConfigs[page] = {};
      }
      if (!state.tableConfigs[page]?.[tabId]) {
        state.tableConfigs[page]![tabId] = {};
      }

      state.tableConfigs[page]![tabId]![name] = config;
    },
    removeTabData(state, action: PayloadAction<RemoveTabDataAction>) {
      const { page, tabId } = action.payload;

      // Remove the tab from all the data
      if (state.query[page]) {
        delete state.query[page]![tabId];
      }
      if (state.results[page]) {
        delete state.results[page]![tabId];
      }
      if (state.tableConfigs[page]) {
        delete state.tableConfigs[page]![tabId];
      }
    },
  },
});

export const { setQuery, setResult, setTableConfig, removeTabData } = dataSlice.actions;
export default dataSlice.reducer;
