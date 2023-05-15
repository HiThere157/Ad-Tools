import stringify from "./stringify";

class ResultArray {
  constructor(public array: ({ __id__?: number } & PSResult)[]) {}

  tagArray = () => {
    // add a unique __id__ field to every entry. used to track selected entries
    this.array = this.array.map((entry, index) => {
      return { __id__: index, ...entry };
    });

    return this;
  };

  sortArray = (sortDescending: boolean, sortColumn: string) => {
    this.array = this.array.slice().sort((a, b) => {
      if (!sortDescending) {
        [a, b] = [b, a];
      }
      return stringify(b[sortColumn]).localeCompare(stringify(a[sortColumn]));
    });

    return this;
  };

  filterArray = (selected: number[], filter: Filter) => {
    this.array = this.array.filter((entry) => {
      // assume entry does match
      let isMatch = true;

      // loop through every filter key
      Object.entries(filter).forEach(([key, value]) => {
        // if __highlight__ key is present, ignore it
        if (key === "__highlight__") return;

        if (key === "__selected__" && typeof entry.__id__ === "number") {
          // if __selected__ key is present in filter, check selected values
          if (!selected.includes(entry.__id__)) {
            isMatch = false;
            return;
          }
        } else {
          // the filter key is not present on the entry, skip it
          if (!Object.keys(entry).includes(key)) return;

          // every other filter value is checked with the entry properties
          // split | and check every value seperately
          // if any value is true, entry is a match
          const matched = value
            .split("|")
            .map((value: string) => {
              const wildcard = value.replace(/[.+^${}()|[\]\\]/g, "\\$&");
              const regex = new RegExp(
                `^${wildcard.replace(/\*/g, ".*").replace(/\?/g, ".")}$`,
                "i",
              );
              return regex.test(stringify(entry[key], false));
            })
            .some((match) => match);

          if (!matched) {
            isMatch = false;
          }
        }
      });

      return isMatch;
    });

    return this;
  };
}

export { ResultArray };
