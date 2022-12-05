import { useState } from "react";

import Button from "./Button";
import Input from "./Input";

import { BsFillPencilFill, BsXLg, BsPlusLg } from "react-icons/bs";
import EditableObject from "./EditableObject";

type SavedFiltersProps = {
  savedFilters: { name: string, filter: { [key: string]: string } }[];
  onChange: Function;
}
export default function SavedFilters({ savedFilters, onChange }: SavedFiltersProps) {
  const [newFilterName, setNewFilterName] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);

  const addFilter = () => {
    onChange([...savedFilters, { name: newFilterName, filter: {} }])
    setNewFilterName("");
  }

  const removeFilter = (index: number) => {
    const newFilters = savedFilters.slice();
    newFilters.splice(index, 1);
    if (index === editingIndex) setEditingIndex(-1);
    onChange(newFilters);
  }

  const filterChange = ({ newName, newFilter }: { newName?: string, newFilter?: { [key: string]: string } }) => {
    const newFilters = savedFilters.slice();
    const changingFilter = newFilters[editingIndex];

    const newFilterObject = {
      name: newName ?? changingFilter.name,
      filter: newFilter ?? changingFilter.filter
    };

    if (changingFilter) newFilters[editingIndex] = newFilterObject;
    onChange(newFilters);
  }

  return (
    <div className="flex items-start space-x-5">
      <table className="border-separate border-spacing-1">
        <tbody>
          {savedFilters.map((savedFilter, index) => {
            return (
              <tr key={index}>
                <td><span className="dark:text-foregroundAccent">{index + 1}:</span></td>
                {index === editingIndex ? (
                  <td><Input value={savedFilter.name} onChange={(newName: string) => { filterChange({ newName }) }}></Input></td>
                ) : (
                  <td><span className="text-lg mx-2">{savedFilter.name}</span></td>
                )}
                <td>
                  <Button
                    classOverride="p-1.5 text-xs"
                    highlight={editingIndex === index}
                    onClick={() => { setEditingIndex(index === editingIndex ? -1 : index) }}>
                    <BsFillPencilFill />
                  </Button>
                  <Button classOverride="p-1.5 text-xs ml-1" onClick={() => { removeFilter(index) }}>
                    <BsXLg />
                  </Button>
                </td>
              </tr>
            )
          })}
          <tr>
            <td colSpan={2}><Input value={newFilterName} onChange={setNewFilterName} onEnter={addFilter} /></td>
            <td>
              <Button classOverride="p-1.5 text-xs" onClick={addFilter}>
                <BsPlusLg />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>

      {editingIndex !== -1 && (
        <div className="container mt-1.5">
          <EditableObject
            object={savedFilters[editingIndex]?.filter ?? {}}
            onChange={(newFilter: { [key: string]: string }) => { filterChange({ newFilter }) }}
          />
        </div>
      )}
    </div>
  )
}