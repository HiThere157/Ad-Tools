const { PowerShell } = require("node-powershell");
const { quote } = require("shell-quote");

const allowedCommands = [
  "Get-ADObject",
  "Get-ADUser",
  "Get-ADGroup",
  "Get-ADGroupMember",
  "Get-ADComputer",
  "Get-WmiObject",
  "Resolve-DnsName",
  "Clear-DnsClientCache",
  "Connect-AzureAD",
  "Get-AzureADCurrentSessionInfo",
  "Get-AzureADUser",
  "Get-AzureADUserMembership",
  "Get-AzureADUserRegisteredDevice",
  "Get-AzureADGroup",
  "Get-AzureADGroupMember",
  "Get-AzureADDevice",
];
const allowedArguments = [
  "Filter",
  "Identity",
  "Server",
  "Properties",
  "Name",
  "ClassName",
  "Namespace",
  "ComputerName",
  "Type",
  "Tenant",
  "ObjectId",
  "SearchString",
  "All",
];
const remoteActions = {
  compmgmt: (target) =>
    `Start-Process compmgmt.msc -ArgumentList "/computer:${target}"`,
  mstsc: (target) => `Start-Process mstsc.exe -ArgumentList "/v:${target}"`,
  powershell: (target) =>
    `Start-Process powershell -ArgumentList '-NoExit -Command "Enter-PSSession ${target}"'`,
};

const getSession = () => {
  return new PowerShell({
    executionPolicy: "Bypass",
    noProfile: true,
  });
};
const staticSession = getSession();

const executeCommand = async (
  _event,
  { command, args, selectFields, useStaticSession, json }
) => {
  if (!allowedCommands.includes(command)) {
    return { error: `Invalid Command "${command}"` };
  }
  for (const key in args) {
    if (!allowedArguments.includes(key)) {
      return { error: `Invalid Argument "${key}"` };
    }
  }

  const ps = useStaticSession ? staticSession : getSession();

  let fullCommand = quote([
    command,
    ...Object.entries(args)
      .map(([key, value]) => {
        return [`-${key}`, value];
      })
      .flat(),
  ]);

  if (selectFields.length > 0) {
    fullCommand = `${fullCommand} | Select-Object ${quote([
      selectFields.join(","),
    ])}`;
  }
  if (json) {
    fullCommand = `${fullCommand} | ConvertTo-Json -Compress`;
  }

  fullCommand = fullCommand.replace(/\\\*/g, "*"); // \* -> *
  fullCommand = fullCommand.replace(/\\@/g, "@"); // \@ -> @
  fullCommand = fullCommand.replace(/\\,/g, ","); // \, -> ,
  fullCommand = fullCommand.replace(/\\\//g, "/"); // \/ -> /

  try {
    const output = await ps.invoke(fullCommand);
    if (!json) return output.raw;
    return {
      output: output.raw ? JSON.parse(output.raw) : [],
    };
  } catch (error) {
    return { error: error.toString().split("At line:1")[0] };
  } finally {
    if (!useStaticSession) ps.dispose();
  }
};

const getExecutingUser = async () => {
  const ps = getSession();
  try {
    const output = await ps.invoke(
      "[System.Security.Principal.WindowsIdentity]::GetCurrent().Name"
    );
    return { output: output.raw };
  } catch (error) {
    return { output: "/", error: error.toString().split("At line:1")[0] };
  } finally {
    ps.dispose();
  }
};

const startComputerAction = async (_event, action, target, useCurrentUser) => {
  if (!Object.keys(remoteActions).includes(action)) {
    return { error: `Invalid Action "${action}"` };
  }

  const ps = getSession();

  let fullCommand = remoteActions[action](quote([target]));

  if (!useCurrentUser) {
    fullCommand = `${fullCommand} -Verb RunAsUser; Start-Sleep -Seconds 10; Wait-Process -Name CredentialUIBroker -ErrorAction SilentlyContinue`;
  }

  try {
    const output = await ps.invoke(fullCommand);
    return { output: output.raw };
  } catch (error) {
    return { error: error.toString().split("At line:1")[0] };
  } finally {
    ps.dispose();
  }
};

module.exports = { executeCommand, getExecutingUser, startComputerAction };
