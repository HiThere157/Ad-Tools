import { usePathMeta } from "../Hooks/utils";

import Tabs from "../Components/Tabs/Tabs";

export default function User() {
  const { page, tab } = usePathMeta();

  return (
    <div>
      <Tabs currentPath={page} currentTab={tab} />
      <h1>User</h1>

      <p>{page}</p>
      <p>{tab}</p>
    </div>
  );
}
