import { useState } from "react"

import Button from "./Button"
import Input from "./Input"

import { BsXLg, BsFillPencilFill, BsPlusLg } from "react-icons/bs"

type EditableListProps = {
  items: string[],
  onChange: Function,
}
export default function EditableList({ items, onChange }: EditableListProps) {
  const [newItem, setNewItem] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);

  const itemChange = (value: string, index: number) => {
    const newItems = items.slice();
    newItems[index] = value;
    onChange(newItems);
  }

  const removeItem = (index: number) => {
    const newItems = items.slice();
    newItems.splice(index, 1);
    setEditingIndex(-1);
    onChange(newItems);
  }

  const addItem = () => {
    onChange([...items, newItem])
    setNewItem("");
  }

  return (
    <table className="border-separate border-spacing-1">
      <tbody>
        {items.map((item, index) => {
          return (
            <tr key={index} >
              <td><span className="dark:text-foregroundAccent">{index + 1}:</span></td>
              {index === editingIndex ? (
                <td><Input value={item} onChange={(value: string) => { itemChange(value, index) }} onEnter={() => { setEditingIndex(-1) }}></Input></td>
              ) : (
                <td><span className="mx-2 text-lg">{item}</span></td>
              )}
              <td>
                <Button
                  classOverride="p-1.5 text-xs"
                  highlight={editingIndex === index}
                  onClick={() => { setEditingIndex(index === editingIndex ? -1 : index) }}>
                  <BsFillPencilFill />
                </Button>
                <Button classOverride="p-1.5 text-xs ml-1" onClick={() => { removeItem(index) }}>
                  <BsXLg />
                </Button>
              </td>
            </tr>
          );
        })}
        <tr>
          <td colSpan={2}><Input value={newItem} onChange={setNewItem} onEnter={addItem}></Input></td>
          <td>
            <Button classOverride="p-1.5 text-xs" onClick={addItem}>
              <BsPlusLg />
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}