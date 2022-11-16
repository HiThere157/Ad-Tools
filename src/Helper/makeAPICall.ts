type ElectronAPI = Window &
  typeof globalThis & {
    electronAPI: {
      getExecutingUser: Function;
      executeCommand: Function;
      probeConnection: Function;
    };
  };

type CommandArgs = {
  Filter?: string;
  Identity?: string;
  Server?: string;
  Properties?: string;
  Name?: string;
};

type ResultData = {
  output?: { [key: string]: any }[];
  error: string;
};

async function makeAPICall(
  command: string,
  args: CommandArgs,
  postProcessor: Function | Function[] = (AdObject: object) => {
    return AdObject;
  },
  callback: Function | Function[] = () => {}
) {
  const postProcessorList = makeToList(postProcessor);
  const callBackList = makeToList(callback);

  callBackList.forEach((callback) => {
    callback({
      output: [],
    });
  });

  try {
    const result = await (window as ElectronAPI).electronAPI.executeCommand(
      command,
      args
    );

    if (result.error) {
      throw result.error;
    }

    callBackList.forEach(async (callback, index) => {
      callback({
        output: await postProcessorList[index](result.output),
      });
    });

    return true;
  } catch (error: any) {
    callBackList.forEach((callback) => {
      callback({
        output: [],
        error: error.toString(),
      });
    });
    return false;
  }
}

// Wrap all Properties in {key: [key], value: [value]} objects (attributes table)
function getPropertiesWrapper(AdObject: {
  PropertyNames: string[];
  [key: string]: string[];
}): { [key: string]: any } {
  return AdObject.PropertyNames.map((property) => {
    return { key: property, value: AdObject[property] };
  });
}

// Get Memberof Property from Get-AdUser Output and extract information
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
  const typeLookup: { [key: number]: { l: string; key: string } } = {
    1: { l: "A", key: "IPAddress" },
    28: { l: "AAAA", key: "IPAddress" },
    12: { l: "PTR", key: "NameHost" },
  };

  return Promise.all(
    makeToList(DNSObjects).map(async (record: any) => {
      const result = record[typeLookup[record.Type].key] ?? "";
      const connection = (
        await (window as ElectronAPI).electronAPI.probeConnection(result)
      ).output;

      return {
        ...record,
        __friendlyType__: typeLookup[record.Type].l ?? "Unknown",
        __result__: result,
        __connection__: connection ? "True" : "False",
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
  makeAPICall,
  getPropertiesWrapper,
  getMembershipFromAdUser,
  prepareDNSResult,
  makeToList,
};
export type { ElectronAPI, ResultData };
