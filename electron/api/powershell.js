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

const getSession = () => {
  return new PowerShell({
    executionPolicy: "Bypass",
    noProfile: true,
  });
};
const staticSession = getSession();

const executeCommand = async (
  _event,
  command,
  args,
  useStaticSession = false
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

(async () => {
  const a = await executeCommand(
    null,
    "Resolve-DnsName",
    { Name: "google.de" },
    true
  );

  const b = await executeCommand(
    null,
    "Resolve-DnsName",
    { Name: "google.de" },
    true
  );

  console.log(a, b);
})();

module.exports = { executeCommand, getExecutingUser };
