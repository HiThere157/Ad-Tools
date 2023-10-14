import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SetActiveTabAction = {
  page: string;
  tabId: number;
};
type AddTabAction = {
  page: string;
  tab: Tab;
};
type UpdateTabAction = {
  page: string;
  tabId: number;
  tab: Partial<Tab>;
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

      state.tabs[page]!.push(tab);
    },
    updateTab: (state, action: PayloadAction<UpdateTabAction>) => {
      const { page, tabId, tab } = action.payload;
      const index = state.tabs[page]?.findIndex((tab) => tab.id === tabId);

      if (index !== undefined && index !== -1) {
        state.tabs[page]![index] = { ...state.tabs[page]![index], ...tab };
      }
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

export const { setActiveTab, addTab, updateTab, removeTab } = tabsSlice.actions;
export default tabsSlice.reducer;
