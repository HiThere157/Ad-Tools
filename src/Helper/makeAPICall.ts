type ElectronAPI = Window &
  typeof globalThis & {
    electronAPI: { getExecutingUser: Function; executeCommand: Function };
  };

type CommandArgs = {
  Identity?: string;
  Server?: string;
  Properties?: string;
  Name?: string;
  QuickTimeout?: string;
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

    callBackList.forEach((callback, index) => {
      callback({
        output: postProcessorList[index](result.output),
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
}): object[] {
  const getCN = (dn: string) => {
    const cn = dn.split(",").filter((unit) => unit.startsWith("CN="))[0];
    return cn?.split("=")[1] ?? "";
  };

  const MemberOf = [AdObject.PrimaryGroup, ...AdObject.MemberOf];
  return MemberOf.map((group) => {
    return { Name: getCN(group), DistinguishedName: group };
  });
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
  makeToList,
};
export type { ElectronAPI, ResultData };
