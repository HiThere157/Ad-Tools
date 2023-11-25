import { invokePSCommand } from "../Helper/api";
import { addServerToResponse, extractFirstObject } from "../Helper/postProcessors";
import { getPSFilter, mergeResponses, removeDuplicates } from "../Helper/utils";

type SingleUserResponse = {
  attributes: Loadable<PSDataSet>;
  groups: Loadable<PSDataSet>;
};
export async function getSingleUser(query: Query): Promise<SingleUserResponse> {
  const { filters, servers } = query;
  const identity = filters.find(({ property }) => property === "Name")?.value ?? "";

  const [attributes, groups] = await Promise.all([
    invokePSCommand({
      command: `Get-AdUser \
      -Identity ${identity} \
      -Server ${servers[0]} \
      -Properties *`,
    }),
    invokePSCommand({
      command: `Get-AdPrincipalGroupMembership \
      -Identity ${identity} \
      -Server ${servers[0]}`,
      selectFields: ["Name", "GroupCategory", "DistinguishedName"],
    }),
  ]);

  return {
    attributes: extractFirstObject(attributes),
    groups: addServerToResponse(groups, servers[0]),
  };
}

type MultipleUsersResponse = {
  users: Loadable<PSDataSet>;
};
export async function getMultipleUsers(query: Query): Promise<MultipleUsersResponse> {
  const { filters, servers } = query;
  const selectFields = removeDuplicates(
    ["Name", "DisplayName"],
    filters.map(({ property }) => property),
  );

  const users = await Promise.all(
    servers.map((server) =>
      invokePSCommand({
        command: `Get-AdUser \
        -Filter "${getPSFilter(filters)}" \
        -Server ${server} \
        -Properties ${selectFields.join(",")}`,
        selectFields,
      }).then((response) => addServerToResponse(response, server, true)),
    ),
  );

  return {
    users: mergeResponses(users),
  };
}