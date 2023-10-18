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
  },
});

export const { toggleNavBar, setTablePreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;
