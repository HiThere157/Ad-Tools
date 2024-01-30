export const migrations = {
  0: (state: any) => {
    // Move printers table preferences to adcomputer table preferences
    state.preferences.tablePreferences.adComputer.printers =
      state.preferences.tablePreferences.printers.printers;

    delete state.preferences.tablePreferences.printers;

    return state;
  },
};
