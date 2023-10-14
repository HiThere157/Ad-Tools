import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import { setQuery } from "../Redux/queries";
import { defaultAdQuery } from "../Config/default";

import AdQuery from "../Components/Query/AdQuery";
import Tabs from "../Components/Tabs/Tabs";

export default function User() {
  const page = "user";
  const { activeTab } = useSelector((state: RootState) => state.tabs);
  const { query } = useSelector((state: RootState) => state.queries);
  const dispatch = useDispatch();

  const pageActiveTab = activeTab[page] ?? 0;
  const tabQuery = query[page]?.[pageActiveTab] ?? defaultAdQuery;

  // const runPreQuery = async () => {
  //   setDataSets({ search: null });

  //   const selectFields = removeDuplicates(["Name", "DisplayName"], Object.keys(query.filter));
  //   const responses = query.servers.map((server) =>
  //     invokePSCommand({
  //       command: `Get-AdUser \
  //         -Filter "${getPSFilterString(query.filter)}" \
  //         -Server ${server} \
  //         -Properties ${selectFields.join(",")}`,
  //       selectFields,
  //     }).then((response) => addServerToResult(response, server)),
  //   );

  //   Promise.all(responses)
  //     .then((responses) => {
  //       setDataSets({ search: mergeResponses(responses) });
  //       updateTab({ icon: "search" });
  //     })
  //     .catch(() => {
  //       updateTab({ icon: "error" });
  //     });

  //   updateTab({ icon: "loading", title: "Search Results" });
  //   setTableConfigs(softResetTables(tableConfigs));
  // };

  // const runQuery = async (query: AdQuery, resetSearch?: boolean) => {
  //   setDataSets({ attributes: null, groups: null }, !resetSearch);

  //   invokePSCommand({
  //     command: `Get-AdUser \
  //       -Identity ${query.filter.Name} \
  //       -Server ${query.servers[0]} \
  //       -Properties *`,
  //   })
  //     .then((response) => {
  //       setDataSets({ attributes: firsObjectToPSDataSet(response) }, true);
  //       updateTab({ icon: "user" });
  //     })
  //     .catch(() => {
  //       updateTab({ icon: "error" });
  //     });

  //   invokePSCommand({
  //     command: `Get-AdPrincipalGroupMembership \
  //       -Identity ${query.filter.Name} \
  //       -Server ${query.servers[0]}`,
  //     selectFields: ["Name", "GroupCategory", "DistinguishedName"],
  //   })
  //     .then((response) => {
  //       setDataSets({ groups: response }, true);
  //     })
  //     .catch(() => {
  //       updateTab({ icon: "error" });
  //     });

  //   updateTab({ icon: "loading", title: query.filter.Name || "User" });
  //   setTableConfigs(softResetTables(tableConfigs, ["attributes", "groups"]));
  // };

  return (
    <div>
      <Tabs page={page} />

      <div className="px-4 py-2">
        <AdQuery
          query={tabQuery}
          setQuery={(query) => dispatch(setQuery({ page, tabId: pageActiveTab, query }))}
          onSubmit={() => {}}
        />
      </div>
    </div>
  );
}
