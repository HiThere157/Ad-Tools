/* eslint-disable  @typescript-eslint/no-non-null-assertion */

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
type MoveTabAction = {
  page: string;
  fromIndex: number;
  toIndex: number;
};
type RemoveTabAction = {
  page: string;
  tabId: number;
};

const tabsSlice = createSlice({
  name: "tabs",
  initialState: {
    activeTab: {} as PartialRecord<string, number>,
    tabs: {} as PartialRecord<string, Tab[]>,
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
      state.activeTab[page] = tab.id;
    },
    updateTab: (state, action: PayloadAction<UpdateTabAction>) => {
      const { page, tabId, tab } = action.payload;
      const index = state.tabs[page]?.findIndex((tab) => tab.id === tabId);

      if (index !== undefined && index !== -1) {
        state.tabs[page]![index] = { ...state.tabs[page]![index], ...tab };
      }
    },
    moveTab: (state, action: PayloadAction<MoveTabAction>) => {
      const { page, fromIndex, toIndex } = action.payload;
      const tabs = state.tabs[page];

      if (tabs) {
        const tab = tabs[fromIndex];
        tabs.splice(fromIndex, 1);
        tabs.splice(toIndex, 0, tab);
      }
    },
    removeTab: (state, action: PayloadAction<RemoveTabAction>) => {
      const { page, tabId } = action.payload;
      const index = state.tabs[page]?.findIndex((tab) => tab.id === tabId) ?? 0;

      state.tabs[page] = state.tabs[page]?.filter((tab) => tab.id !== tabId);

      // If the active tab was removed
      if (state.activeTab[page] === tabId) {
        // If there is a tab at the same index, set it as active
        if (state.tabs[page]?.[index]) {
          state.activeTab[page] = state.tabs[page]?.[index]?.id;
        } else {
          // If there is no tab at the same index, set the last tab as active (if last tab was removed)
          const length = state.tabs[page]?.length ?? 0;
          state.activeTab[page] = state.tabs[page]?.[length - 1]?.id;
        }
      }
    },
  },
});

export const { setActiveTab, addTab, updateTab, moveTab, removeTab } = tabsSlice.actions;
export default tabsSlice.reducer;
