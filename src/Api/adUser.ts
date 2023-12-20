import { invokePSCommand } from "../Helper/api";
import { addServerToResponse, extractFirstObject } from "../Helper/postProcessors";
import { formatAdFilter, mergeResponses, removeDuplicates } from "../Helper/utils";

type SingleUserResponse = {
  attributes: Promise<Loadable<PSDataSet>>;
  memberof: Promise<Loadable<PSDataSet>>;
};
export function getSingleAdUser(identity: string, server: string): SingleUserResponse {
  const attributes = invokePSCommand({
    command: `Get-AdUser \
      -Identity "${identity}" \
      -Server ${server} \
      -Properties *`,
  });
  const memberof = invokePSCommand({
    command: `Get-AdPrincipalGroupMembership \
      -Identity "${identity}" \
      -Server ${server}`,
    selectFields: ["Name", "GroupCategory", "DistinguishedName"],
  });

  return {
    attributes: attributes.then(extractFirstObject),
    memberof: memberof.then((memberof) => addServerToResponse(memberof, server)),
  };
}

type MultipleUsersResponse = {
  users: Promise<Loadable<PSDataSet>>;
};
export function getMultipleAdUsers(
  filters: QueryFilter[],
  servers: string[],
): MultipleUsersResponse {
  const selectFields = removeDuplicates(
    ["Name", "DisplayName"],
    filters.map(({ property }) => property),
  );

  const users = Promise.all(
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
    users: users.then(mergeResponses),
  };
}
