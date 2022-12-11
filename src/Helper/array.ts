import { Entry } from "../Types/api";

import stringify from "./stringify";

class EntryArray {
  constructor(public array: Entry[]) {}

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

  filterArray = (selected: number[], filter: { [key: string]: string }) => {
    this.array = this.array.filter((entry) => {
      let isMatch = true;
      Object.entries(filter).forEach(([key, value]) => {
        // if __selected__ key is present in filter, check selected values
        // prevent regex check after
        if (key === "__selected__") {
          isMatch = selected.includes(entry.__id__);
          return;
        }

        // every other filter value is checked with the entry properties
        // split | and check every value seperately
        // if any value is true, entry is a match
        const matched = value
          .split("|")
          .map((value: string) => {
            const wildcard = value.replace(/[.+^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(`^${wildcard.replace(/\*/g, ".*").replace(/\?/g, ".")}$`, "i");
            return regex.test(stringify(entry[key], false));
          })
          .some((match) => match);

        if (!matched) {
          isMatch = false;
        }
      });

      return isMatch;
    });

    return this;
  };
}

export { EntryArray };
