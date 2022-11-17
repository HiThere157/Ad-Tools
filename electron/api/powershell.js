const { PowerShell } = require("node-powershell");
const { quote } = require("shell-quote");

const allowedCommands = [
  "Get-ADObject",
  "Get-ADUser",
  "Get-ADGroup",
  "Get-ADGroupMember",
  "Get-ADComputer",
  "Resolve-DnsName",
];

const allowedArguments = ["Filter", "Identity", "Server", "Properties", "Name"];

const executeCommand = async (_event, command, args) => {
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

  fullCommand = fullCommand.replace("\\*", "*");

  try {
    const output = await ps.invoke(fullCommand + " | ConvertTo-Json");
    return { output: output.raw ? JSON.parse(output.raw) : [] };
  } catch (error) {
    return { error: error.toString().split("At line:1")[0] };
  } finally {
    ps.dispose();
  }
};

const getExecutingUser = async () => {
  const ps = new PowerShell({
    executionPolicy: "Bypass",
    noProfile: true,
  });

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

module.exports = { executeCommand, getExecutingUser };
