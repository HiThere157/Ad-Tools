import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SetTablePreferencesAction = {
  key: string;
  preferences: TablePreferences;
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    isNavBarExpanded: true,
    tablePreferences: {} as PartialRecord<string, TablePreferences>,
  },
  reducers: {
    toggleNavBar: (state) => {
      state.isNavBarExpanded = !state.isNavBarExpanded;
    },
    setTablePreferences: (state, action: PayloadAction<SetTablePreferencesAction>) => {
      const { key, preferences } = action.payload;

      state.tablePreferences[key] = preferences;
    },
  },
});

export const { toggleNavBar, setTablePreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;
