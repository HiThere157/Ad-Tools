type ChangeTabAction = {
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

type Tab = {
  icon?: "user" | "search" | "loading" | "error";
  id: number;
  title: string;
};
