type ColumnDefinition = {
  title: string;
  key: string;
  sortable: boolean;
};

const domains: string[] = ["Alcon.net", "Alconnet.com", "Itlab.local"];
const columns: { [key: string]: ColumnDefinition[] } = {
  attribute: [
    { title: "Key", key: "key", sortable: true },
    { title: "Value", key: "value", sortable: true },
  ],
  small: [
    { title: "Name", key: "Name", sortable: true },
    { title: "Distinguished Name", key: "DistinguishedName", sortable: true },
  ],
  big: [
    { title: "Name", key: "Name", sortable: true },
    { title: "Type", key: "ObjectClass", sortable: true },
    { title: "Distinguished Name", key: "DistinguishedName", sortable: true },
  ],
};

export { domains, columns };
export type { ColumnDefinition };
