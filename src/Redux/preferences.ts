import { createSlice } from "@reduxjs/toolkit";

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    isNavBarExpanded: true,
  },
  reducers: {
    toggleNavBar: (state) => {
      state.isNavBarExpanded = !state.isNavBarExpanded;
    },
  },
});

export const { toggleNavBar } = preferencesSlice.actions;
export default preferencesSlice.reducer;