import { AdComputerTables, Pages } from "../Config/const";

export const migrations = {
  0: (state: any) => {
    state.preferences.tablePreferences[Pages.AdComputer][AdComputerTables.Printers] =
      state.preferences.tablePreferences.printers.printers;

    return state;
  },
};
