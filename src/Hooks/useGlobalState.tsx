import { createContext, useState, useContext, Dispatch, SetStateAction } from "react";

const GlobalStateContext = createContext({
  state: {} as Partial<GlobalState>,
  setState: {} as Dispatch<SetStateAction<Partial<GlobalState>>>,
});

type GlobalStateProviderProps = {
  children: React.ReactNode;
  value?: Partial<GlobalState>;
};
const GlobalStateProvider = ({ children, value = {} as GlobalState }: GlobalStateProviderProps) => {
  const [state, setState] = useState<Partial<GlobalState>>(value);
  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateContext");
  }
  return context;
};

export { GlobalStateProvider, useGlobalState };
