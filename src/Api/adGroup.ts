import { invokePSCommand } from "../Helper/api";
import { extractFirstObject, addServerToResponse } from "../Helper/postProcessors";
import { removeDuplicates, formatAdFilter, mergeResponses } from "../Helper/utils";

type SingleGroupResponse = {
  attributes: Promise<ResultDataSet>;
  members: Promise<ResultDataSet>;
  memberof: Promise<ResultDataSet>;
};
export function getSingleAdGroup(identity: string, server: string): SingleGroupResponse {
  const attributes = invokePSCommand({
    command: `Get-AdGroup \
      -Identity "${identity}" \
      -Server ${server} \
      -Properties *`,
  });
  const members = invokePSCommand({
    command: `Get-AdGroupMember \
      -Identity "${identity}" \
      -Server ${server}`,
    selectFields: ["Name", "SamAccountName", "DistinguishedName", "ObjectClass"],
  });
  const memberof = invokePSCommand({
    command: `Get-AdPrincipalGroupMembership \
      -Identity "${identity}" \
      -Server ${server}`,
    selectFields: ["Name", "GroupCategory", "DistinguishedName"],
  });

  return {
    attributes: attributes.then(extractFirstObject),
    members: members.then((members) => addServerToResponse(members, server)),
    memberof: memberof.then((memberof) => addServerToResponse(memberof, server)),
  };
}

type MultipleGroupsResponse = {
  groups: Promise<ResultDataSet>;
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
        command: `Get-AdGroup \
        -Filter "${formatAdFilter(filters)}" \
        -Server ${server} \
        -Properties ${selectFields.join(",")}`,
        selectFields,
      }).then((response) => addServerToResponse(response, server, true)),
    ),
  );

  return {
    groups: groups.then(mergeResponses),
  };
}
