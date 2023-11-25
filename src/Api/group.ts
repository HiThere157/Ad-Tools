import { invokePSCommand } from "../Helper/api";
import { extractFirstObject, addServerToResponse } from "../Helper/postProcessors";
import { removeDuplicates, getPSFilter, mergeResponses } from "../Helper/utils";

type SingleGroupResponse = {
  attributes: Loadable<PSDataSet>;
  members: Loadable<PSDataSet>;
  memberof: Loadable<PSDataSet>;
};
export async function getSingleGroup(query: Query): Promise<SingleGroupResponse> {
  const identity = query.filters.find(({ property }) => property === "Name")?.value ?? "";

  const [attributes, members, memberof] = await Promise.all([
    invokePSCommand({
      command: `Get-AdGroup \
      -Identity ${identity} \
      -Server ${query.servers[0]} \
      -Properties *`,
    }),
    invokePSCommand({
      command: `Get-AdGroupMember \
      -Identity ${identity} \
      -Server ${query.servers[0]}`,
      selectFields: ["Name", "SamAccountName", "DistinguishedName", "ObjectClass"],
    }),
    invokePSCommand({
      command: `Get-AdPrincipalGroupMembership \
      -Identity ${identity} \
      -Server ${query.servers[0]}`,
      selectFields: ["Name", "GroupCategory", "DistinguishedName"],
    }),
  ]);

  return {
    attributes: extractFirstObject(attributes),
    members: addServerToResponse(members, query.servers[0]),
    memberof: addServerToResponse(memberof, query.servers[0]),
  };
}

type MultipleGroupsResponse = {
  groups: Loadable<PSDataSet>;
};
export async function getMultipleGroups(query: Query): Promise<MultipleGroupsResponse> {
  const selectFields = removeDuplicates(
    ["Name", "Description"],
    query.filters.map(({ property }) => property),
  );
  const groups = await Promise.all(
    query.servers.map((server) =>
      invokePSCommand({
        command: `Get-AdGroup \
        -Filter "${getPSFilter(query.filters)}" \
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
