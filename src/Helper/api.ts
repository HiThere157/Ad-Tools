import { ElectronAPI } from "../../electron/preload";

export const electronWindow = window as Window & typeof globalThis & { electronAPI?: ElectronAPI };

export async function invokePSCommand(
  request: InvokePSCommandRequest,
): Promise<Loadable<PSDataSet>> {
  if (!electronWindow.electronAPI) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          result: {
            columns: ["Age", "Name", "Location"],
            data: [
              { __id__: 1, Age: 20, Name: "John", Location: "USA" },
              { __id__: 2, Age: 30, Name: "Jane", Location: "UK" },
              { __id__: 3, Age: 40, Name: "Joe", Location: "Canada" },
              {
                __id__: 4,
                Age: 50,
                Name: "Jilllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll",
                Location: "Australia",
              },
              { __id__: 5, Age: 60, Name: "Jack", Location: "New Zealand" },
            ],
          },
          timestamp: Date.now(),
          executionTime: 0,
        });
      }, 1000);
    });
  }

  return electronWindow.electronAPI.invokePSCommand(request);
}

export async function loginAzure(upn: string): Promise<AzureEnvironment> {
  if (!electronWindow.electronAPI) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          executingAzureUser: "API@NOTFOUND",
        });
      }, 1000);
    });
  }

  const env = await electronWindow.electronAPI.invokePSCommand({
    command: `Connect-AzureAD -AccountId ${upn}`,
    selectFields: ["Account"],
  });

  return {
    executingAzureUser: env?.result?.data?.[0]?.Account?.Id ?? "",
  };
}

export async function getElectronEnvironment(): Promise<ElectronEnvironment> {
  if (!electronWindow.electronAPI) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          executingUser: "API\\NOTFOUND",
          appVersion: "v0.0.0",
          appChannel: "stable",
        });
      }, 1000);
    });
  }

  return electronWindow.electronAPI.getElectronEnvironment();
}

export async function getAzureEnvironment(): Promise<AzureEnvironment> {
  if (!electronWindow.electronAPI) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          executingAzureUser: "API@NOTFOUND",
        });
      }, 1000);
    });
  }

  const env = await electronWindow.electronAPI.invokePSCommand({
    command: "Get-AzureADCurrentSessionInfo",
    selectFields: ["Account"],
  });

  return {
    executingAzureUser: env?.result?.data?.[0]?.Account?.Id ?? "",
  };
}

export async function getPowershellEnvironment(): Promise<PowershellEnvironment> {
  if (!electronWindow.electronAPI) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          adVersion: null,
          azureAdVersion: null,
        });
      }, 1000);
    });
  }

  const formatVersion = (env: Loadable<PSDataSet>, module: string) => {
    const version = env?.result?.data?.find((m) => m.Name === module)?.Version;
    if (!version) return "";

    const { Major: major, Minor: minor, Build: build } = version;
    return `v${major}.${minor}.${build}`;
  };

  const env = await electronWindow.electronAPI.invokePSCommand({
    command: "Get-Module -ListAvailable -Name AzureAd,ActiveDirectory",
    selectFields: ["Name", "Version"],
  });

  return {
    adVersion: formatVersion(env, "ActiveDirectory"),
    azureAdVersion: formatVersion(env, "AzureAD"),
  };
}

export async function getDnsSuffixList(): Promise<string[]> {
  if (!electronWindow.electronAPI) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(["domain1.com", "domain2.com", "domain3.com"]);
      }, 1000);
    });
  }

  const dns = await electronWindow.electronAPI.invokePSCommand({
    command: "Get-DnsClientGlobalSetting",
  });

  return dns?.result?.data?.[0]?.SuffixSearchList ?? [];
}
