import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SetQueryAction = {
  page: string;
  tabId: number;
  query: AdQuery;
};
type SetResultAction = {
  page: string;
  tabId: number;
  name: string;
  result: Loadable<PSDataSet>;
};
type SetTableConfigAction = {
  page: string;
  tabId: number;
  name: string;
  config: TableConfig;
};

const dataSlice = createSlice({
  name: "data",
  initialState: {
    query: {} as TabStorage<AdQuery>,
    results: {} as TabStorage<PartialRecord<string, Loadable<PSDataSet>>>,
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
      if (!state.results[page]![tabId]) {
        state.results[page]![tabId] = {};
      }

      state.results[page]![tabId]![name] = result;
    },
    setTableConfig: (state, action: PayloadAction<SetTableConfigAction>) => {
      const { page, tabId, name, config } = action.payload;

      // If the page or tab doesn't exist, create it
      if (!state.tableConfigs[page]) {
        state.tableConfigs[page] = {};
      }
      if (!state.tableConfigs[page]![tabId]) {
        state.tableConfigs[page]![tabId] = {};
      }

      state.tableConfigs[page]![tabId]![name] = config;
    },
  },
});

export const { setQuery, setResult, setTableConfig } = dataSlice.actions;
export default dataSlice.reducer;