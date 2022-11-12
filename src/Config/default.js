const domains = ["Alcon.net", "Alconnet.com", "Itlab.local"];
const columns = {
  attribute: [
    { title: "Key", key: "key", sortable: true },
    { title: "Value", key: "value", sortable: true },
  ],
  memberOf: [
    { title: "Name", key: "Name", sortable: true },
    { title: "Distinguished Name", key: "DistinguishedName", sortable: true },
  ],
  members: [
    {title: "Name", key: "Name", sortable: true},
    {title: "Type", key: "ObjectClass", sortable: true},
    {title: "Distinguished Name", key: "DistinguishedName", sortable: true},
  ]
};

export { domains, columns };
