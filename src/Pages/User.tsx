import { useSessionStorage } from "../Hooks/useStorage";

import Tabs from "../Components/Tabs/Tabs";

export default function User() {
  const page = "user";
  const [tab, setTab] = useSessionStorage<number>(`tab_${page}`, 0);

  return (
    <div>
      <Tabs currentPath={page} currentTab={tab} setCurrentTab={setTab} />
      <h1>User</h1>
    </div>
  );
}
