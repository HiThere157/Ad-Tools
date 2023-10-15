import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SetQueryAction = {
  page: string;
  tabId: number;
  query: AdQuery;
};
type SetResultAction = {
  page: string;
  tabId: number;
  key: string;
  result: Loadable<PSDataSet>;
};
type SetTableConfigAction = {
  page: string;
  tabId: number;
  key: string;
  config: VolatileTableConfig;
};

const dataSlice = createSlice({
  name: "data",
  initialState: {
    query: {} as TabStorage<AdQuery>,
    results: {} as TabStorage<PartialRecord<string, Loadable<PSDataSet>>>,
    tableConfigs: {} as TabStorage<PartialRecord<string, VolatileTableConfig>>,
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
      const { page, tabId, key, result } = action.payload;

      // If the page or tab doesn't exist, create it
      if (!state.results[page]) {
        state.results[page] = {};
      }
      if (!state.results[page]![tabId]) {
        state.results[page]![tabId] = {};
      }

      state.results[page]![tabId]![key] = result;
    },
    setTableConfig: (state, action: PayloadAction<SetTableConfigAction>) => {
      const { page, tabId, key, config } = action.payload;

      // If the page or tab doesn't exist, create it
      if (!state.tableConfigs[page]) {
        state.tableConfigs[page] = {};
      }
      if (!state.tableConfigs[page]![tabId]) {
        state.tableConfigs[page]![tabId] = {};
      }

      state.tableConfigs[page]![tabId]![key] = config;
    },
  },
});

export const { setQuery, setResult, setTableConfig } = dataSlice.actions;
export default dataSlice.reducer;
