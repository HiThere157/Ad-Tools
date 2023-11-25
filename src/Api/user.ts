import { invokePSCommand } from "../Helper/api";
import { addServerToResponse, extractFirstObject } from "../Helper/postProcessors";
import { formatAdFilter, getFilterValue, mergeResponses, removeDuplicates } from "../Helper/utils";

type SingleUserResponse = {
  attributes: Loadable<PSDataSet>;
  memberof: Loadable<PSDataSet>;
};
export async function getSingleUser(query: Query): Promise<SingleUserResponse> {
  const { filters, servers } = query;
  const identity = getFilterValue(filters, "Name");

  const [attributes, memberof] = await Promise.all([
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
    memberof: addServerToResponse(memberof, servers[0]),
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
        -Filter "${formatAdFilter(filters)}" \
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
