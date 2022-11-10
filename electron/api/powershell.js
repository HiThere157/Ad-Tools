const { PowerShell } = require("node-powershell");
const { quote } = require("shell-quote");

/*
User:
	Get-ADUser -Identity -Server -Properties
	(Get-ADPrincipalGroupMembership) -Identity -Server

Group:
	Get-ADGroup -Identity -Server -Properties
	Get-ADGroupMember -Identity -Server
	(Get-ADPrincipalGroupMembership) -Identity -Server

Computer:
	Resolve-DnsName -Name -QuickTimeout
	Get-ADComputer -Identity -Server -Properties
	(Get-ADPrincipalGroupMembership) -Identity -Server
*/

const allowedCommands = [
  "Get-ADUser",
  "Get-ADGroup",
  "Get-ADComputer",
  "Get-ADPrincipalGroupMembership",
  "Resolve-DnsName",
];

const allowedArguments = [
  "Identity",
  "Server",
  "Properties",
  "Name",
  "QuickTimeout",
];

const executeCommand = async (event, command, args) => {
  if (!allowedCommands.includes(command)) {
    return { error: `Invalid Command "${command}"` };
  }

  for (const key in args) {
    if (!allowedArguments.includes(key)) {
      return { error: `Invalid Argument "${key}"` };
    }
  }

  const ps = new PowerShell({
    executionPolicy: "Bypass",
    noProfile: true,
  });

  fullCommand = quote([
    command,
    ...Object.entries(args)
      .map(([key, value]) => {
        return [`-${key}`, value];
      })
      .flat(),
  ]);

  try {
    const output = await ps.invoke(fullCommand + " | ConvertTo-Json");
    return { output: JSON.parse(output.raw) };
  } catch (error) {
    return { error: error };
  } finally {
    ps.dispose();
  }
};

module.exports = { executeCommand };
