import { invokePSCommand } from "../Helper/api";
import { extractFirstObject, addServerToResponse } from "../Helper/postProcessors";
import { removeDuplicates, formatAdFilter, mergeResponses } from "../Helper/utils";

type GetSingleComputerResponse = {
  dns: Promise<ResultDataSet>;
  attributes: Promise<ResultDataSet>;
  memberof: Promise<ResultDataSet>;
};
export function getSingleAdComputer(identity: string, server: string): GetSingleComputerResponse {
  const dns = invokePSCommand({
    command: `Resolve-DnsName -Name "${identity}.${server}"`,
    selectFields: ["Name", "Type", "IPAddress"],
  });
  const attributes = invokePSCommand({
    command: `Get-AdComputer \
      -Identity "${identity}" \
      -Server ${server} \
      -Properties *`,
  });
  const memberof = invokePSCommand({
    command: `Get-AdPrincipalGroupMembership \
      (Get-AdComputer -Identity "${identity}" -Server ${server}) \
      -Server ${server}`,
    selectFields: ["Name", "GroupCategory", "DistinguishedName"],
  });

  return {
    dns,
    attributes: attributes.then(extractFirstObject),
    memberof: memberof.then((memberof) => addServerToResponse(memberof, server)),
  };
}

type MultipleComputersResponse = {
  computers: Promise<ResultDataSet>;
};
export function getMultipleAdComputers(
  filters: QueryFilter[],
  servers: string[],
): MultipleComputersResponse {
  const selectFields = removeDuplicates(
    ["Name", "DisplayName"],
    filters.map(({ property }) => property),
  );

  const computers = Promise.all(
    servers.map((server) =>
      invokePSCommand({
        command: `Get-AdComputer \
        -Filter "${formatAdFilter(filters)}" \
        -Server ${server} \
        -Properties ${selectFields.join(",")}`,
        selectFields,
      }).then((response) => addServerToResponse(response, server, true)),
    ),
  );

  return {
    computers: computers.then(mergeResponses),
  };
}
