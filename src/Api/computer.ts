import { invokePSCommand } from "../Helper/api";
import { extractFirstObject, addServerToResponse } from "../Helper/postProcessors";
import { removeDuplicates, formatAdFilter, mergeResponses, getFilterValue } from "../Helper/utils";

type getSingleComputerResponse = {
  dns: Loadable<PSDataSet>;
  attributes: Loadable<PSDataSet>;
  memberof: Loadable<PSDataSet>;
};
export async function getSingleComputer(query: Query): Promise<getSingleComputerResponse> {
  const { filters, servers } = query;
  const identity = getFilterValue(filters, "Name");

  const [dns, attributes, memberof] = await Promise.all([
    invokePSCommand({
      command: `Resolve-DnsName -Name ${identity}.${servers[0]}`,
      selectFields: ["Name", "Type", "IPAddress"],
    }),
    invokePSCommand({
      command: `Get-AdComputer \
      -Identity ${identity} \
      -Server ${servers[0]} \
      -Properties *`,
    }),
    invokePSCommand({
      command: `Get-AdPrincipalGroupMembership \
      (Get-AdComputer -Identity ${identity} -Server ${servers[0]}) \
      -Server ${servers[0]}`,
      selectFields: ["Name", "GroupCategory", "DistinguishedName"],
    }),
  ]);

  return {
    dns,
    attributes: extractFirstObject(attributes),
    memberof: addServerToResponse(memberof, servers[0]),
  };
}

type MultipleComputersResponse = {
  computers: Loadable<PSDataSet>;
};
export async function getMultipleComputers(query: Query): Promise<MultipleComputersResponse> {
  const { filters, servers } = query;
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
