import { invokePSCommand } from "../Helper/api";
import { remoteIndent } from "../Helper/string";
import { extractFirstObject, resolveASCIIArray } from "../Helper/postProcessors";

type GetSingleWmiInfoResponse = {
  monitors: Promise<DataSet>;
  sysinfo: Promise<DataSet>;
  software: Promise<DataSet>;
  bios: Promise<DataSet>;
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
    monitors: monitors
      .then((monitors) => resolveASCIIArray(monitors, "UserFriendlyName"))
      .then((monitors) => resolveASCIIArray(monitors, "SerialNumberID")),
    sysinfo: sysinfo.then(extractFirstObject),
    software,
    bios: bios.then(extractFirstObject),
  };
}
