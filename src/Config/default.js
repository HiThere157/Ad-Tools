const domains = ["Alcon.net", "Alconnet.com", "Itlab.local"];
const columns = {
  attribute: [
    { title: "Key", key: "key", sortable: true },
    { title: "Value", key: "value", sortable: true },
  ],
  memberof: [
    { title: "Name", key: "name", sortable: true },
    { title: "Distinguished Name", key: "distinguishedName", sortable: true },
  ],
};

export { domains, columns };
