/* eslint-disable  @typescript-eslint/no-non-null-assertion */

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SetQueryAction = {
  page: string;
  tabId: number;
  query: Query;
};
type SetDataSetAction = {
  page: string;
  tabId: number;
  name: string;
  dataSet: DataSet;
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
    dataSets: {} as TabStorage<PartialRecord<string, DataSet>>,
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
    setDataSet: (state, action: PayloadAction<SetDataSetAction>) => {
      const { page, tabId, name, dataSet } = action.payload;

      // If the page or tab doesn't exist, create it
      if (!state.dataSets[page]) {
        state.dataSets[page] = {};
      }
      if (!state.dataSets[page]?.[tabId]) {
        state.dataSets[page]![tabId] = {};
      }

      state.dataSets[page]![tabId]![name] = dataSet;

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
      if (state.dataSets[page]) {
        delete state.dataSets[page]![tabId];
      }
      if (state.tableConfigs[page]) {
        delete state.tableConfigs[page]![tabId];
      }
    },
    pushQueryLog: (state, action: PayloadAction<QueryLog>) => {
      const page = "history";
      const tabId = 0;
      const name = "queryLog";

      // If the page, tab or result doesn't exist, create it
      if (!state.dataSets[page]) {
        state.dataSets[page] = {};
      }
      if (!state.dataSets[page]?.[tabId]) {
        state.dataSets[page]![tabId] = {};
      }
      if (!state.dataSets[page]![tabId]![name]) {
        state.dataSets[page]![tabId]![name] = {
          result: {
            data: [],
            columns: ["command", "timestamp", "executionTime", "success"],
          },
        };
      }

      // Push the log to the result
      const id = state.dataSets[page]![tabId]![name]!.result?.data.length ?? 0;
      const log: ResultObject = { ...action.payload, __id__: id };

      state.dataSets[page]![tabId]![name]!.result?.data.push(log);
    },
  },
});

export const { setQuery, setDataSet, setTableConfig, removeTabData, pushQueryLog } =
  dataSlice.actions;
export default dataSlice.reducer;