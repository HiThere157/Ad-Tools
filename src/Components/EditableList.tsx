import { useState } from "react"

import Button from "./Button"
import Input from "./Input"

import { BsXLg, BsPlusLg } from "react-icons/bs"

type EditableListProps = {
  items: string[],
  onChange: Function,
}
export default function EditableList({ items, onChange }: EditableListProps) {
  const [newItem, setNewItem] = useState("");

  const itemChange = (value: string, index: number) => {
    const newItems = items.slice();
    newItems[index] = value;
    onChange(newItems);
  }

  const itemRemove = (index: number) => {
    const newItems = items.slice();
    newItems.splice(index, 1);
    onChange(newItems);
  }

  const addItem = () => {
    onChange([...items, newItem])
    setNewItem("");
  }

  return (
    <div className="flex flex-col space-y-1.5">
      {items.map((item, index) => {
        return (
          <div key={index} className="flex space-x-1">
            <Input value={item} onChange={(value: string) => { itemChange(value, index) }}></Input>
            <Button classOverride="p-1.5 text-xs" onClick={() => { itemRemove(index) }}>
              <BsXLg />
            </Button>
          </div>
        );
      })}
      <div className="flex space-x-1">
        <Input value={newItem} onChange={setNewItem} onEnter={addItem}></Input>
        <Button classOverride="p-1.5 text-xs" onClick={addItem}>
          <BsPlusLg />
        </Button>
      </div>
    </div>
  )
}