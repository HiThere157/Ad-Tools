import { invokePSCommand } from "../Helper/api";
import { extractFirstObject, addServerToResponse } from "../Helper/postProcessors";
import { removeDuplicates, formatAdFilter, mergeResponses } from "../Helper/utils";

type SingleGroupResponse = {
  attributes: Loadable<PSDataSet>;
  members: Loadable<PSDataSet>;
  memberof: Loadable<PSDataSet>;
};
export async function getSingleAdGroup(
  identity: string,
  server: string,
): Promise<SingleGroupResponse> {
  const [attributes, members, memberof] = await Promise.all([
    invokePSCommand({
      command: `Get-AdGroup \
      -Identity ${identity} \
      -Server ${server} \
      -Properties *`,
    }),
    invokePSCommand({
      command: `Get-AdGroupMember \
      -Identity ${identity} \
      -Server ${server}`,
      selectFields: ["Name", "SamAccountName", "DistinguishedName", "ObjectClass"],
    }),
    invokePSCommand({
      command: `Get-AdPrincipalGroupMembership \
      -Identity ${identity} \
      -Server ${server}`,
      selectFields: ["Name", "GroupCategory", "DistinguishedName"],
    }),
  ]);

  return {
    attributes: extractFirstObject(attributes),
    members: addServerToResponse(members, server),
    memberof: addServerToResponse(memberof, server),
  };
}

type MultipleGroupsResponse = {
  groups: Loadable<PSDataSet>;
};
export async function getMultipleAdGroups(
  filters: QueryFilter[],
  servers: string[],
): Promise<MultipleGroupsResponse> {
  const selectFields = removeDuplicates(
    ["Name", "Description"],
    filters.map(({ property }) => property),
  );

  const groups = await Promise.all(
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
    groups: mergeResponses(groups),
  };
}
