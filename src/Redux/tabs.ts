import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SetActiveTabAction = {
  page: string;
  tabId: number;
};
type AddTabAction = {
  page: string;
  tab: Tab;
};
type RemoveTabAction = {
  page: string;
  tabId: number;
};

const tabsSlice = createSlice({
  name: "tabs",
  initialState: {
    activeTab: {} as PageStorage<number>,
    tabs: {} as PageStorage<Tab[]>,
  },
  reducers: {
    setActiveTab: (state, action: PayloadAction<SetActiveTabAction>) => {
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

export const { setActiveTab, addTab, removeTab } = tabsSlice.actions;
export default tabsSlice.reducer;
