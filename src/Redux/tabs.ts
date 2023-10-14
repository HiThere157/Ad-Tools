import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const tabsSlice = createSlice({
  name: "tabs",
  initialState: {
    activeTab: {} as PartialRecord<string, number>,
    tabs: {} as PartialRecord<string, Tab[]>,
  },
  reducers: {
    changeActiveTab: (state, action: PayloadAction<ChangeTabAction>) => {
      const { page, tabId } = action.payload;
      state.activeTab[page] = tabId;
    },
    addTab: (state, action: PayloadAction<AddTabAction>) => {
      const { page, tab } = action.payload;

      // If the page doesn't exist, create it
      if (!state.tabs[page]) {
        state.tabs[page] = [];
      }

      state.tabs[page]?.push(tab);
    },
    removeTab: (state, action: PayloadAction<RemoveTabAction>) => {
      const { page, tabId } = action.payload;
      state.tabs[page] = state.tabs[page]?.filter((tab) => tab.id !== tabId);

      // If the active tab was removed, set the first tab as active
      if (state.activeTab[page] === tabId) {
        state.activeTab[page] = state.tabs[page]?.[0]?.id;
      }
    },
  },
});

export const { changeActiveTab, addTab, removeTab } = tabsSlice.actions;
export default tabsSlice.reducer;
