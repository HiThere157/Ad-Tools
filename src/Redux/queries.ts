import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const queriesSlice = createSlice({
  name: "queries",
  initialState: {
    query: {} as PartialRecord<string, PartialRecord<number, AdQuery>>,
  },
  reducers: {
    setQuery: (state, action: PayloadAction<SetQueryAction>) => {
      const { page, tabId, query } = action.payload;
      if (!state.query[page]) {
        state.query[page] = {};
      }

      state.query[page]![tabId] = query;
    },
  },
});

export const { setQuery } = queriesSlice.actions;
export default queriesSlice.reducer;
