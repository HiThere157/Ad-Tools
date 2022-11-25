import { ElectronAPI } from "./makeAPICall";

// Wrap all Properties in {key: [key], value: [value]} objects (attributes table)
function getPropertiesWrapper(AdObject: {
  PropertyNames?: string[];
  [key: string]: any;
}): { [key: string]: any } {
  const properties = AdObject.PropertyNames ?? Object.keys(AdObject);

  return properties.map((property) => {
    return { key: property, value: AdObject[property] };
  });
}

function getExtensionsFromAadUser(Adbject: {
  ExtensionProperty: { [key: string]: string }
}): { [key: string]: any } {
  return getPropertiesWrapper(Adbject.ExtensionProperty);
}

function getMembershipFromAdUser(AdObject: {
  MemberOf: string[];
  PrimaryGroup: string;
}): { Name: string; DistinguishedName: string }[] {
  const getCN = (dn: string) => {
    const cn = dn.split(",").filter((unit) => unit.startsWith("CN="))[0];
    return cn?.split("=")[1] ?? "";
  };

  const MemberOf = [...AdObject.MemberOf];
  if (AdObject.PrimaryGroup) MemberOf.push(AdObject.PrimaryGroup);

  return MemberOf.map((group) => {
    return { Name: getCN(group), DistinguishedName: group };
  });
}

async function prepareDNSResult(
  DNSObjects: { Type: number } | { Type: number }[]
): Promise<
  {
    Type: number;
    __friendlyType__: string;
    __result__: string;
    __connection__: string;
  }[]
> {
  const typeLookup: { [key: number]: { l: string; key: string | string[] } } = {
    1: { l: "A", key: "IPAddress" },
    2: { l: "NS", key: "NameHost" },
    6: { l: "SOA", key: ["PrimaryServer", "Administrator", "Name"] },
    12: { l: "PTR", key: "NameHost" },
    15: { l: "MX", key: "NameExchange" },
    16: { l: "TXT", key: "Text" },
    28: { l: "AAAA", key: "IPAddress" },
  };

  return Promise.all(
    makeToList(DNSObjects).map(async (record: any) => {
      let result;
      let connection = "";

      const resultKey = typeLookup[record.Type]?.key;
      if (!Array.isArray(resultKey)) {
        result = record[resultKey] ?? "";
      } else {
        result = Object.fromEntries(
          Object.entries(record).filter(([key]) => resultKey.includes(key))
        );
      }

      if (["A", "NS", "AAAA", "PTR"].includes(typeLookup[record.Type]?.l)) {
        connection = (
          await (window as ElectronAPI).electronAPI.probeConnection(result)
        ).output
          ? "True"
          : "False";
      }

      return {
        ...record,
        __friendlyType__:
          typeLookup[record.Type]?.l ?? `Unknown (${record.Type})`,
        __result__: result,
        __connection__: connection,
      };
    })
  );
}

function makeToList(AdObject: any[] | any): any[] {
  if (!Array.isArray(AdObject)) {
    return [AdObject];
  }
  return AdObject;
}

export {
  getPropertiesWrapper,
  getExtensionsFromAadUser,
  getMembershipFromAdUser,
  prepareDNSResult,
  makeToList,
};