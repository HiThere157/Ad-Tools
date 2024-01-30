import { invokePSCommand } from "../Helper/api";
import { removeIndent } from "../Helper/string";
import { extractFirstObject, addServerToDataSet } from "../Helper/postProcessors";
import { formatAdFilter, mergeDataSets } from "../Helper/utils";

export function getAdComputer(
  identity: string,
  server: string,
  dnsFields: string[] = [],
  memberofFields: string[] = [],
  printerFields: string[] = [],
) {
  const dns = invokePSCommand({
    command: `Resolve-DnsName -Name "${identity}.${server}"`,
    selectFields: dnsFields,
  });
  const attributes = invokePSCommand({
    command: removeIndent(`Get-AdComputer
      -Identity "${identity}"
      -Server ${server}
      -Properties *`),
  });
  const memberof = invokePSCommand({
    command: removeIndent(`Get-AdPrincipalGroupMembership
      (Get-AdComputer -Identity "${identity}" -Server ${server})
      -Server ${server}`),
    selectFields: memberofFields,
  });
  const printers = invokePSCommand({
    command: `Get-Printer -Computername "${identity}.${server}"`,
    selectFields: printerFields,
  });

  return {
    dns,
    attributes: attributes.then(extractFirstObject),
    memberof: memberof.then((memberof) => addServerToDataSet(memberof, server)),
    printers,
  };
}

export function searchAdComputers(
  filters: QueryFilter[],
  servers: string[],
  searchFields: string[] = [],
) {
  const search = Promise.all(
    servers.map((server) =>
      invokePSCommand({
        command: removeIndent(`Get-AdComputer
        -Filter "${formatAdFilter(filters)}"
        -Server ${server}
        -Properties ${searchFields.join(",")}`),
        selectFields: searchFields,
      }).then((dataSet) => addServerToDataSet(dataSet, server)),
    ),
  );

  return {
    search: search.then(mergeDataSets),
  };
}
