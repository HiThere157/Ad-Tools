import { stringify } from "./string";

export function filterData(data: ResultObject[], filters: TableFilter[]) {
  return data.filter((row) => {
    // Loop over all the filters, and check if the row matches all of them
    return filters.every((filter) => {
      if (filter.value.length === 0) return true;

      // If any of the filter values match, the filter matches
      const valueArray = Array.isArray(filter.value) ? filter.value : [filter.value];
      return valueArray.some((filterValue) => {
        const regexValue = filterValue.replace(/\*/g, ".*");
        const regex = new RegExp(`^${regexValue}$`, "i");

        const value = stringify(row[filter.column]);
        return regex.test(value);
      });
    });
  });
}

export function sortData(data: ResultObject[], sort: SortConfig) {
  const { column, direction } = sort;

  return [...data].sort((a, b) => {
    if (direction === "desc") {
      [a, b] = [b, a];
    }

    return stringify(a[column]).localeCompare(stringify(b[column]));
  });
}

export function paginateData(data: ResultObject[], page: number, pageSize: number) {
  if (pageSize === -1) return data;

  return data.slice(page * pageSize, (page + 1) * pageSize);
}

export function colorData(data: ResultObject[], highlights: TableHighlight[]) {
  return data.map((row) => {
    let bgColor = "transparent";
    let fgColor = "inherit";

    // Only loop over the actual values, not __id__ or __highlight__
    const rowValues = Object.entries(row)
      .filter(([key]) => !key.startsWith("__"))
      .map(([, value]) => value);

    // Loop over the highlights, and check if the row matches the highlight
    highlights.forEach((highlight) => {
      const { color, strings } = highlight;
      if (strings.length === 0) return;

      // Loop over all the strings for this color, and check if the row matches any of them
      strings.forEach((string) => {
        const fields = string.split(",");

        // If every field of the string matches, the highlight rule matches
        if (
          fields.every((field) => {
            const regexValue = field.replace(/\*/g, ".*");
            const regex = new RegExp(`^${regexValue}$`, "i");

            // If any of the values match, the field matches
            return rowValues.some((value) => regex.test(stringify(value)));
          })
        ) {
          if (highlight.type === "fg") fgColor = color;
          if (highlight.type === "bg") bgColor = color;
        }
      });
    });

    return { __highlight_bg__: bgColor, __highlight_fg__: fgColor, ...row };
  });
}
