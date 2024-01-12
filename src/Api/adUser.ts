import { invokePSCommand } from "../Helper/api";
import { remoteIndent } from "../Helper/string";
import { addServerToDataSet, extractFirstObject } from "../Helper/postProcessors";
import { formatAdFilter, mergeDataSets, removeDuplicates } from "../Helper/utils";

type SingleUserResponse = {
  attributes: Promise<DataSet>;
  memberof: Promise<DataSet>;
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
    memberof: memberof.then((memberof) => addServerToDataSet(memberof, server)),
  };
}

type MultipleUsersResponse = {
  users: Promise<DataSet>;
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
      }).then((dataSet) => addServerToDataSet(dataSet, server, true)),
    ),
  );

  return {
    users: users.then(mergeDataSets),
  };
}
