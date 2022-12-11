module.exports = {
  "Get-ADUser": {
    args: ["Identity", "Filter", "Server", "Properties"],
    charWhitelist: ["*"],
  },
  "Get-ADGroup": {
    args: ["Identity", "Filter", "Server", "Properties"],
    charWhitelist: ["*"],
  },
  "Get-ADGroupMember": {
    args: ["Identity", "Server"],
    charWhitelist: [],
  },
  "Get-ADComputer": {
    args: ["Identity", "Filter", "Server", "Properties"],
    charWhitelist: ["*"],
  },
  "Get-WmiObject": {
    args: ["ClassName", "Namespace", "ComputerName"],
    charWhitelist: [],
  },
  "Resolve-DnsName": {
    args: ["Name", "Type"],
    charWhitelist: [],
  },
  "Get-Printer": {
    args: ["ComputerName"],
    charWhitelist: [],
  },
  "Clear-DnsClientCache": {
    args: [],
    charWhitelist: [],
  },
  "Connect-AzureAD": {
    args: ["Tenant"],
    charWhitelist: [],
  },
  "Get-AzureADCurrentSessionInfo": {
    args: [],
    charWhitelist: [],
  },
  "Get-AzureADUser": {
    args: ["ObjectId", "SearchString", "All"],
    charWhitelist: ["@"],
  },
  "Get-AzureADUserMembership": {
    args: ["ObjectId", "All"],
    charWhitelist: ["@"],
  },
  "Get-AzureADUserRegisteredDevice": {
    args: ["ObjectId", "All"],
    charWhitelist: ["@"],
  },
  "Get-AzureADGroup": {
    args: ["ObjectId", "SearchString", "All"],
    charWhitelist: [],
  },
  "Get-AzureADGroupMember": {
    args: ["ObjectId", "All"],
    charWhitelist: [],
  },
  "Get-AzureADDevice": {
    args: ["ObjectId", "SearchString", "All"],
    charWhitelist: [],
  },
};
