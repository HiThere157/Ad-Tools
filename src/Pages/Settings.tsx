import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { setQueryDomains } from "../Redux/preferences";

import EditList from "../Components/EditList";

export default function Settings() {
  const { queryDomains } = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();

  return (
    <div className="p-2">
      <h2 className="ms-2 text-2xl font-bold">Query Domains</h2>
      <EditList list={queryDomains} onChange={(list) => dispatch(setQueryDomains(list))} />
    </div>
  );
}
