type SingleDropdownBodyProps = {
  items: string[];
  onChange: (value: string) => void;
};
export function SingleDropdownBody({ items, onChange }: SingleDropdownBodyProps) {
  return (
    <div className="absolute mt-0.5 w-full">
      {items.map((item, index) => (
        <button
          key={index}
          className="w-full rounded border-2 border-border bg-secondary px-2 hover:border-borderAccent hover:bg-secondaryAccent active:border-borderActive active:bg-secondaryActive"
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

type MultipleDropdownBodyProps = {
  items: string[];
  values: string[];
  onChange: (values: string[]) => void;
};
export function MultipleDropdownBody({
  items,
  values,
  onChange,
}: MultipleDropdownBodyProps) {
  return (
    <div className="absolute mt-0.5 w-full">
      {items.map((item, index) => (
        <label
          key={index}
          className="flex items-center gap-2 rounded border-2 border-border bg-secondary px-2 hover:border-borderAccent hover:bg-secondaryAccent active:border-borderActive active:bg-secondaryActive"
        >
          <input
            type="checkbox"
            checked={values.includes(item)}
            onChange={(event) => {
              if (event.target.checked) {
                onChange([...values, item]);
              } else {
                onChange(values.filter((value) => value !== item));
              }
            }}
          />
          {item}
        </label>
      ))}
    </div>
  );
}
