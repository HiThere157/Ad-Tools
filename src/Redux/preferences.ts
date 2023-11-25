import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SetTablePreferencesAction = {
  page: string;
  name: string;
  preferences: TablePreferences;
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    isNavBarExpanded: true,
    tablePreferences: {} as PageStorage<PartialRecord<string, TablePreferences>>,
    queryDomains: [] as string[],
    azureLogin: {
      upn: "",
      rememberChoice: false,
    },
  },
  reducers: {
    toggleNavBar: (state) => {
      state.isNavBarExpanded = !state.isNavBarExpanded;
    },
    setTablePreferences: (state, action: PayloadAction<SetTablePreferencesAction>) => {
      const { page, name, preferences } = action.payload;

      if (!state.tablePreferences[page]) {
        state.tablePreferences[page] = {};
      }

      state.tablePreferences[page]![name] = preferences;
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

export const { toggleNavBar, setTablePreferences, setDefaultQueryDomains, setQueryDomains } =
  preferencesSlice.actions;
export default preferencesSlice.reducer;
