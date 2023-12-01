import { invokePSCommand } from "../Helper/api";
import { addServerToResponse, extractFirstObject } from "../Helper/postProcessors";
import { formatAdFilter, mergeResponses, removeDuplicates } from "../Helper/utils";

type SingleUserResponse = {
  attributes: Loadable<PSDataSet>;
  memberof: Loadable<PSDataSet>;
};
export async function getSingleAdUser(
  identity: string,
  server: string,
): Promise<SingleUserResponse> {
  const [attributes, memberof] = await Promise.all([
    invokePSCommand({
      command: `Get-AdUser \
      -Identity ${identity} \
      -Server ${server} \
      -Properties *`,
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
    memberof: addServerToResponse(memberof, server),
  };
}

type MultipleUsersResponse = {
  users: Loadable<PSDataSet>;
};
export async function getMultipleAdUsers(
  filters: QueryFilter[],
  servers: string[],
): Promise<MultipleUsersResponse> {
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
