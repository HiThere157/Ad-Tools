const { PowerShell } = require("node-powershell");
const { quote } = require("shell-quote");
const whitelist = require("./powershell.wl");

const remoteActions = {
  compmgmt: (target) => `Start-Process compmgmt.msc -ArgumentList "/computer:${target}"`,
  mstsc: (target) => `Start-Process mstsc.exe -ArgumentList "/v:${target}"`,
  powershell: (target) =>
    `Start-Process powershell -ArgumentList '-NoExit -Command "Enter-PSSession ${target}"'`,
};

const invokeWrapper = async ({ ps, fullCommand, json = false, dispose = true }) => {
  try {
    const output = await ps.invoke(fullCommand);
    if (!json) return { output: output.raw };
    return {
      output: output.raw ? JSON.parse(output.raw) : [],
    };
  } catch (error) {
    return { error: error.toString().split("At line:1")[0] };
  } finally {
    if (dispose) ps.dispose();
  }
};

const getSession = () => {
  return new PowerShell({
    executionPolicy: "Bypass",
    noProfile: true,
  });
};
const staticSession = getSession();

const executeCommand = async (_event, { command, args, selectFields, useStaticSession, json }) => {
  if (!Object.keys(whitelist).includes(command)) {
    return { error: `Invalid Command "${command}"` };
  }
  for (const argument in args) {
    if (!whitelist[command].args.includes(argument)) {
      return {
        error: `Invalid Argument "${argument}" for command "${command}"`,
      };
    }
  }

  let fullCommand = quote([
    command,
    ...Object.entries(args)
      .map(([key, value]) => {
        return [`-${key}`, value];
      })
      .flat(),
  ]);
  if (selectFields.length > 0) {
    const selectedFields = quote([selectFields.join(",")]).replace(/\\,/g, ",");
    fullCommand = `${fullCommand} | Select-Object ${selectedFields}`;
  }
  if (json) {
    fullCommand = `${fullCommand} | ConvertTo-Json -Compress`;
  }

  // fix escaping of "-Properties *"
  fullCommand = fullCommand.replace("-Properties \\*", "-Properties *");

  // undo escaping from quote lib on whitelisted characters e.g. @
  for (const char of whitelist[command].charWhitelist ?? []) {
    const regex = new RegExp(`\\\\${char}`, "g");
    fullCommand = fullCommand.replace(regex, char);
  }

  return await invokeWrapper({
    ps: useStaticSession ? staticSession : getSession(),
    fullCommand,
    json,
    dispose: !useStaticSession,
  });
};

const getExecutingUser = async () => {
  return await invokeWrapper({
    ps: getSession(),
    fullCommand: "[System.Security.Principal.WindowsIdentity]::GetCurrent().Name",
  });
};

const getDomainSuffixList = async () => {
  return await invokeWrapper({
    ps: getSession(),
    fullCommand: "Get-DnsClientGlobalSetting | ConvertTo-Json -Compress",
    json: true,
  });
};

const startComputerAction = async (_event, action, target, useCurrentUser) => {
  if (!Object.keys(remoteActions).includes(action)) {
    return { error: `Invalid Action "${action}"` };
  }

  let fullCommand = remoteActions[action](quote([target]));
  if (!useCurrentUser) {
    fullCommand = `${fullCommand} -Verb RunAsUser; Start-Sleep -Seconds 10; Wait-Process -Name CredentialUIBroker -ErrorAction SilentlyContinue`;
  }

  return await invokeWrapper({ ps: getSession(), fullCommand });
};

const authAzureAD = async (_event, tenant, useCredentials) => {
  let fullCommand = "Connect-AzureAD";

  if (tenant) {
    fullCommand = `${fullCommand} -Tenant ${quote([tenant])}`;
  }
  if (useCredentials) {
    fullCommand = `${fullCommand} -Credential (Get-Credential)`;
  }

  return await invokeWrapper({ ps: staticSession, fullCommand, dispose: false });
};

module.exports = {
  executeCommand,
  getExecutingUser,
  getDomainSuffixList,
  startComputerAction,
  authAzureAD,
};
