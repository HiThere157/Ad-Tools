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
    query: {} as PartialRecord<string, PartialRecord<number, Query>>,
    dataSets: {} as PartialRecord<string, PartialRecord<number, PartialRecord<string, DataSet>>>,
    tableConfigs: {} as PartialRecord<
      string,
      PartialRecord<number, PartialRecord<string, TableConfig>>
    >,
    toasts: [] as Toast[],
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
          data: [],
        };
      }

      // Push the log to the result
      const id = state.dataSets[page][tabId][name].data?.length ?? 0;
      const log: ResultObject = { ...action.payload, __id__: id };

      state.dataSets[page][tabId][name].data?.push(log);
    },
    pushToast: (state, action: PayloadAction<Toast>) => {
      if (state.toasts.some(({ message }) => message === action.payload.message)) return;

      state.toasts.push(action.payload);
    },
    setToasts: (state, action: PayloadAction<Toast[]>) => {
      state.toasts = action.payload;
    },
  },
});

export const {
  setQuery,
  setDataSet,
  setTableConfig,
  removeTabData,
  pushQueryLog,
  pushToast,
  setToasts,
} = dataSlice.actions;
export default dataSlice.reducer;
