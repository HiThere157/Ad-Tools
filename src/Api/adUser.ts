import { invokePSCommand } from "../Helper/api";
import { removeIndent } from "../Helper/string";
import { addServerToDataSet, extractFirstObject } from "../Helper/postProcessors";
import { formatAdFilter, mergeDataSets } from "../Helper/utils";

export function getAdUser(identity: string, server: string, memberofFields: string[] = []) {
  const attributes = invokePSCommand({
    command: removeIndent(`Get-AdUser
      -Identity "${identity}"
      -Server ${server}
      -Properties *`),
  });
  const memberof = invokePSCommand({
    command: removeIndent(`Get-AdPrincipalGroupMembership
      -Identity "${identity}"
      -Server ${server}`),
    selectFields: memberofFields,
  });

  return {
    attributes: attributes.then(extractFirstObject),
    memberof: memberof.then((memberof) => addServerToDataSet(memberof, server)),
  };
}

export function searchAdUsers(
  filters: QueryFilter[],
  servers: string[],
  searchFields: string[] = [],
) {
  const search = Promise.all(
    servers.map((server) =>
      invokePSCommand({
        command: removeIndent(`Get-AdUser
        -Filter "${formatAdFilter(filters)}"
        -Server ${server}
        -Properties ${searchFields.join(",")}`),
        selectFields: searchFields,
      }).then((dataSet) => addServerToDataSet(dataSet, server)),
    ),
  );

  return {
    search: search.then(mergeDataSets),
  };
}
