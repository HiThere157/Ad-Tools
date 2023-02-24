import EditableObject from "../EditableObject";

type AdvancedFiltersProps = {
  filter: Filter;
  onFilterChange: (newFilter: Filter) => any;
  isLocked?: boolean;
};
export default function AdvancedFilters({
  filter,
  onFilterChange,
  isLocked = false,
}: AdvancedFiltersProps) {
  return (
    <div className="container flex mb-1">
      <span className="ml-1 mr-2 mt-1.5">Filters:</span>
      <EditableObject
        object={filter}
        onChange={onFilterChange}
        isLocked={isLocked}
        placeholder={{ key: "Property", value: "Filter" }}
      />
    </div>
  );
}
