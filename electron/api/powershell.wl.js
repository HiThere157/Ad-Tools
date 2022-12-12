module.exports = {
  "Get-ADUser": {
    args: ["Identity", "Filter", "Server", "Properties"],
  },
  "Get-ADGroup": {
    args: ["Identity", "Filter", "Server", "Properties"],
  },
  "Get-ADGroupMember": {
    args: ["Identity", "Server"],
  },
  "Get-ADComputer": {
    args: ["Identity", "Filter", "Server", "Properties"],
  },
  "Get-WmiObject": {
    args: ["ClassName", "Namespace", "ComputerName"],
  },
  "Resolve-DnsName": {
    args: ["Name", "Type"],
  },
  "Get-Printer": {
    args: ["ComputerName"],
  },
  "Clear-DnsClientCache": {
    args: [],
  },
  "Connect-AzureAD": {
    args: ["Tenant"],
  },
  "Get-AzureADCurrentSessionInfo": {
    args: [],
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
  },
  "Get-AzureADGroupMember": {
    args: ["ObjectId", "All"],
  },
  "Get-AzureADDevice": {
    args: ["ObjectId", "SearchString", "All"],
  },
};
