const excludeFields = (string, excludeFields) => {
  let filtered = string;

  excludeFields.forEach((field) => {
    const regex = new RegExp(`"${field}":\\[.+?\\],`, "g");
    console.log(regex)
    filtered = filtered.replace(regex, "2222");
  });

  return filtered;
};

module.exports = { excludeFields };
