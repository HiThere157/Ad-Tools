module.exports = {
  "Get-ADUser": {
    args: ["Identity", "Filter", "Server", "Properties"],
    charWhitelist: [","],
  },
  "Get-ADGroup": {
    args: ["Identity", "Filter", "Server", "Properties"],
    charWhitelist: [","],
  },
  "Get-ADGroupMember": {
    args: ["Identity", "Server"],
  },
  "Get-ADComputer": {
    args: ["Identity", "Filter", "Server", "Properties"],
    charWhitelist: [","],
  },
  "Get-WmiObject": {
    args: ["ClassName", "Namespace", "ComputerName"],
  },
  "Resolve-DnsName": {
    args: ["Name", "Type"],
  },
  "Get-ADObject": {
    args: ["Filter", "Server"],
  },
  "Get-ADDomainController": {
    args: ["DomainName", "Discover"],
  },
  "Get-ADReplicationAttributeMetadata": {
    args: ["Object", "Server"],
  },
  "Get-Printer": {
    args: ["ComputerName"],
  },
  "Clear-DnsClientCache": {
    args: [],
  },
  "Disconnect-AzureAD": {
    args: [],
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
