// Wrap all Properties in {key: [key], value: [value]} objects (attributes table)
function getPropertiesWrapper(Obj: { PropertyNames?: string[] } & PSResult): PSResult[] {
  const properties = Obj.PropertyNames ?? Object.keys(Obj);

  return properties.map((property) => {
    return { key: property, value: Obj[property] };
  });
}
function getWMIPropertiesWrapper(
  Obj: {
    Properties: { Name: string }[];
  } & PSResult,
): PSResult[] {
  const properties = Obj.Properties.map((property) => property.Name);

  return properties.map((property) => {
    return { key: property, value: Obj[property] };
  });
}
function getExtensionsFromAadUser(Adbject: { ExtensionProperty: PSResult }): PSResult[] {
  return getPropertiesWrapper(Adbject.ExtensionProperty);
}

function getMembershipFromAdObject(AdObject: {
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

function replaceASCIIArray(MonitorWMI: PSResult | PSResult[]): PSResult[] {
  const keysToReplace = ["UserFriendlyName", "SerialNumberID"];

  const asciiToString = (asciiArray: number[]) => {
    try {
      return String.fromCharCode(...asciiArray.filter((char) => char !== 0));
    } catch {
      return "null";
    }
  };

  return makeToList(MonitorWMI).map((monitor) => {
    const entries = Object.entries(monitor);
    return Object.fromEntries(
      entries.map(([key, value]) => {
        if (keysToReplace.includes(key)) {
          return [key, asciiToString(value as number[])];
        }
        return [key, value];
      }),
    );
  });
}

async function prepareDNSResult(DNSObjects: { Type: number } | { Type: number }[]): Promise<
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
          Object.entries(record).filter(([key]) => resultKey.includes(key)),
        );
      }

      if (["A", "NS", "AAAA", "PTR"].includes(typeLookup[record.Type]?.l)) {
        connection = (await (window as ElectronAPI).electronAPI?.probeConnection(result))?.output
          ? "True"
          : "False";
      }

      return {
        ...record,
        __friendlyType__: typeLookup[record.Type]?.l ?? `Unknown (${record.Type})`,
        __result__: result,
        __connection__: connection,
      };
    }),
  );
}

function replacePrinterStatus(
  PrinterObject: { PrinterStatus: number } | { PrinterStatus: number }[],
): PSResult[] {
  return makeToList(PrinterObject).map((printer) => {
    const statusLookup: { [key: number]: string } = {
      0: "Normal",
      1: "Paused",
      2: "Error",
    };

    return {
      ...printer,
      __friendlyStatus__:
        statusLookup[printer.PrinterStatus] ?? `Unknown (${printer.PrinterStatus})`,
    };
  });
}

function makeToList<T>(AdObject: T[] | T): T[] {
  if (!Array.isArray(AdObject)) {
    return [AdObject];
  }
  return AdObject;
}

export {
  getPropertiesWrapper,
  getWMIPropertiesWrapper,
  getExtensionsFromAadUser,
  getMembershipFromAdObject,
  replaceASCIIArray,
  prepareDNSResult,
  replacePrinterStatus,
  makeToList,
};
