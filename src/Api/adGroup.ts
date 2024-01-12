import { invokePSCommand } from "../Helper/api";
import { remoteIndent } from "../Helper/string";
import { extractFirstObject, addServerToDataSet } from "../Helper/postProcessors";
import { removeDuplicates, formatAdFilter, mergeDataSets } from "../Helper/utils";

type SingleGroupResponse = {
  attributes: Promise<DataSet>;
  members: Promise<DataSet>;
  memberof: Promise<DataSet>;
};
export function getSingleAdGroup(identity: string, server: string): SingleGroupResponse {
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
    selectFields: ["Name", "SamAccountName", "DistinguishedName", "ObjectClass"],
  });
  const memberof = invokePSCommand({
    command: remoteIndent(`Get-AdPrincipalGroupMembership
      -Identity "${identity}"
      -Server ${server}`),
    selectFields: ["Name", "GroupCategory", "DistinguishedName"],
  });

  return {
    attributes: attributes.then(extractFirstObject),
    members: members.then((members) => addServerToDataSet(members, server)),
    memberof: memberof.then((memberof) => addServerToDataSet(memberof, server)),
  };
}

type MultipleGroupsResponse = {
  groups: Promise<DataSet>;
};
export function getMultipleAdGroups(
  filters: QueryFilter[],
  servers: string[],
): MultipleGroupsResponse {
  const selectFields = removeDuplicates(
    ["Name", "Description"],
    filters.map(({ property }) => property),
  );

  const groups = Promise.all(
    servers.map((server) =>
      invokePSCommand({
        command: remoteIndent(`Get-AdGroup
        -Filter "${formatAdFilter(filters)}"
        -Server ${server}
        -Properties ${selectFields.join(",")}`),
        selectFields,
      }).then((dataSet) => addServerToDataSet(dataSet, server, true)),
    ),
  );

  return {
    groups: groups.then(mergeDataSets),
  };
}
