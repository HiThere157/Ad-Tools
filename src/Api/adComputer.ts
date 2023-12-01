import { invokePSCommand } from "../Helper/api";
import { extractFirstObject, addServerToResponse } from "../Helper/postProcessors";
import { removeDuplicates, formatAdFilter, mergeResponses } from "../Helper/utils";

type getSingleComputerResponse = {
  dns: Loadable<PSDataSet>;
  attributes: Loadable<PSDataSet>;
  memberof: Loadable<PSDataSet>;
};
export async function getSingleAdComputer(
  identity: string,
  server: string,
): Promise<getSingleComputerResponse> {
  const [dns, attributes, memberof] = await Promise.all([
    invokePSCommand({
      command: `Resolve-DnsName -Name ${identity}.${server}`,
      selectFields: ["Name", "Type", "IPAddress"],
    }),
    invokePSCommand({
      command: `Get-AdComputer \
      -Identity ${identity} \
      -Server ${server} \
      -Properties *`,
    }),
    invokePSCommand({
      command: `Get-AdPrincipalGroupMembership \
      (Get-AdComputer -Identity ${identity} -Server ${server}) \
      -Server ${server}`,
      selectFields: ["Name", "GroupCategory", "DistinguishedName"],
    }),
  ]);

  return {
    dns,
    attributes: extractFirstObject(attributes),
    memberof: addServerToResponse(memberof, server),
  };
}

type MultipleComputersResponse = {
  computers: Loadable<PSDataSet>;
};
export async function getMultipleAdComputers(
  filters: QueryFilter[],
  servers: string[],
): Promise<MultipleComputersResponse> {
  const selectFields = removeDuplicates(
    ["Name", "DisplayName"],
    filters.map(({ property }) => property),
  );

  const computers = await Promise.all(
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
    computers: mergeResponses(computers),
  };
}
