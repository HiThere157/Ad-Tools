const { PowerShell } = require("node-powershell");

(async () => {
  const ps = new PowerShell({
    executionPolicy: "Bypass",
    noProfile: true,
  });

  const output = await ps.invoke(
    "Resolve-DnsName -Name google.de -Type All | ConvertTo-Json -Compress"
  );

  console.log(output.raw.replace(/"Data":\[.+?\],/g, "222"));
  ps.dispose();
})();
