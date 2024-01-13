import { invokePSCommand } from "../Helper/api";
import { remoteIndent } from "../Helper/string";
import { extractFirstObject, resolveASCIIArray } from "../Helper/postProcessors";

export function getWmiInfo(
  identity: string,
  server: string,
  monitorsFields: string[] = [],
  softwareFields: string[] = [],
  biosFields: string[] = [],
) {
  const monitors = invokePSCommand({
    command: remoteIndent(`Get-WmiObject
      -ClassName WmiMonitorID
      -Namespace root/wmi
      -Computername "${identity}.${server}"`),
    selectFields: monitorsFields,
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
    selectFields: softwareFields,
  });
  const bios = invokePSCommand({
    command: remoteIndent(`Get-WmiObject
      -ClassName Win32_BIOS
      -Computername "${identity}.${server}"`),
    selectFields: biosFields,
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
