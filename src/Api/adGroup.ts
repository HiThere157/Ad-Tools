import { invokePSCommand } from "../Helper/api";
import { remoteIndent } from "../Helper/string";
import { extractFirstObject, addServerToDataSet } from "../Helper/postProcessors";
import { formatAdFilter, mergeDataSets } from "../Helper/utils";

export function getAdGroup(
  identity: string,
  server: string,
  membersFields: string[] = [],
  memberofFields: string[] = [],
) {
  const attributes = invokePSCommand({
    command: remoteIndent(`Get-AdGroup
      -Identity "${identity}"
      -Server ${server}
      -Properties *`),
  });
  const members = invokePSCommand({
    command: remoteIndent(`Get-AdGroupMember
      -Identity "${identity}"
      -Server ${server}`),
    selectFields: membersFields,
  });
  const memberof = invokePSCommand({
    command: remoteIndent(`Get-AdPrincipalGroupMembership
      -Identity "${identity}"
      -Server ${server}`),
    selectFields: memberofFields,
  });

  return {
    attributes: attributes.then(extractFirstObject),
    members: members.then((members) => addServerToDataSet(members, server)),
    memberof: memberof.then((memberof) => addServerToDataSet(memberof, server)),
  };
}

export function searchAdGroups(
  filters: QueryFilter[],
  servers: string[],
  searchFields: string[] = [],
) {
  const search = Promise.all(
    servers.map((server) =>
      invokePSCommand({
        command: remoteIndent(`Get-AdGroup
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
