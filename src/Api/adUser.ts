import { invokePSCommand } from "../Helper/api";
import { remoteIndent } from "../Helper/string";
import { addServerToResponse, extractFirstObject } from "../Helper/postProcessors";
import { formatAdFilter, mergeResponses, removeDuplicates } from "../Helper/utils";

type SingleUserResponse = {
  attributes: Promise<ResultDataSet>;
  memberof: Promise<ResultDataSet>;
};
export function getSingleAdUser(identity: string, server: string): SingleUserResponse {
  const attributes = invokePSCommand({
    command: remoteIndent(`Get-AdUser
      -Identity "${identity}"
      -Server ${server}
      -Properties *`),
  });
  const memberof = invokePSCommand({
    command: remoteIndent(`Get-AdPrincipalGroupMembership
      -Identity "${identity}"
      -Server ${server}`),
    selectFields: ["Name", "GroupCategory", "DistinguishedName"],
  });

  return {
    attributes: attributes.then(extractFirstObject),
    memberof: memberof.then((memberof) => addServerToResponse(memberof, server)),
  };
}

type MultipleUsersResponse = {
  users: Promise<ResultDataSet>;
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
        command: remoteIndent(`Get-AdUser
        -Filter "${formatAdFilter(filters)}"
        -Server ${server}
        -Properties ${selectFields.join(",")}`),
        selectFields,
      }).then((response) => addServerToResponse(response, server, true)),
    ),
  );

  return {
    users: users.then(mergeResponses),
  };
}
