import { invokePSCommand } from "../Helper/api";
import { remoteIndent } from "../Helper/string";
import { extractFirstObject, addServerToDataSet } from "../Helper/postProcessors";
import { removeDuplicates, formatAdFilter, mergeDataSets } from "../Helper/utils";

type GetSingleComputerResponse = {
  dns: Promise<DataSet>;
  attributes: Promise<DataSet>;
  memberof: Promise<DataSet>;
};
export function getSingleAdComputer(identity: string, server: string): GetSingleComputerResponse {
  const dns = invokePSCommand({
    command: `Resolve-DnsName -Name "${identity}.${server}"`,
    selectFields: ["Name", "Type", "IPAddress"],
  });
  const attributes = invokePSCommand({
    command: remoteIndent(`Get-AdComputer
      -Identity "${identity}"
      -Server ${server}
      -Properties *`),
  });
  const memberof = invokePSCommand({
    command: remoteIndent(`Get-AdPrincipalGroupMembership
      (Get-AdComputer -Identity "${identity}" -Server ${server})
      -Server ${server}`),
    selectFields: ["Name", "GroupCategory", "DistinguishedName"],
  });

  return {
    dns,
    attributes: attributes.then(extractFirstObject),
    memberof: memberof.then((memberof) => addServerToDataSet(memberof, server)),
  };
}

type MultipleComputersResponse = {
  computers: Promise<DataSet>;
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
        command: remoteIndent(`Get-AdComputer
        -Filter "${formatAdFilter(filters)}"
        -Server ${server}
        -Properties ${selectFields.join(",")}`),
        selectFields,
      }).then((dataSet) => addServerToDataSet(dataSet, server, true)),
    ),
  );

  return {
    computers: computers.then(mergeDataSets),
  };
}
