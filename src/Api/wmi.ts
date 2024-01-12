import { invokePSCommand } from "../Helper/api";
import { remoteIndent } from "../Helper/string";
import { extractFirstObject } from "../Helper/postProcessors";

type GetSingleWmiInfoResponse = {
  monitors: Promise<ResultDataSet>;
  sysinfo: Promise<ResultDataSet>;
  software: Promise<ResultDataSet>;
  bios: Promise<ResultDataSet>;
};
export function getSingleWmiInfo(identity: string, server: string): GetSingleWmiInfoResponse {
  const monitors = invokePSCommand({
    command: remoteIndent(`Get-WmiObject
      -ClassName WmiMonitorID
      -Namespace root/wmi
      -Computername "${identity}.${server}"`),
    selectFields: ["UserFriendlyName", "SerialNumberID", "YearOfManufacture"],
  });
  const sysinfo = invokePSCommand({
    command: remoteIndent(`Get-WmiObject
      -ClassName Win32_ComputerSystem
      -Computername "${identity}.${server}"`),
  });
  const software = invokePSCommand({
    command: remoteIndent(`Get-WmiObject
      -ClassName Win32_Product
      -Computername "${identity}.${server}"`),
    selectFields: ["Name", "Vendor", "Version", "InstallDate"],
  });
  const bios = invokePSCommand({
    command: remoteIndent(`Get-WmiObject
      -ClassName Win32_BIOS
      -Computername "${identity}.${server}"`),
    selectFields: ["Name", "Manufacturer", "Version", "ReleaseDate"],
  });

  return {
    monitors,
    sysinfo: sysinfo.then(extractFirstObject),
    software,
    bios: bios.then(extractFirstObject),
  };
}
