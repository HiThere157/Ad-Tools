import { useState, useEffect } from "react";

import Button from "./Button";
import Input from "./Input";
import Title from "./Title";

import { BsXLg, BsFillPencilFill, BsPlusLg } from "react-icons/bs";

type EditableListProps = {
  items: string[];
  onChange: (newItems: string[]) => any;
  isLocked?: boolean;
  placeholder?: string;
};
export default function EditableList({
  items,
  onChange,
  isLocked = false,
  placeholder,
}: EditableListProps) {
  const [newItem, setNewItem] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const itemChange = (value: string, index: number) => {
    const newItems = items.slice();
    newItems[index] = value;
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.slice();
    newItems.splice(index, 1);
    setEditingIndex(-1);
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...items, newItem]);
    setNewItem("");
  };

  useEffect(() => {
    if (isLocked) setEditingIndex(-1);
  }, [isLocked]);

  return (
    <table className="border-separate border-spacing-1">
      <tbody>
        {items.map((item, index) => {
          return (
            <tr key={index}>
              <td>
                <span className="dark:text-whiteColorAccent">{index + 1}:</span>
              </td>
              {index === editingIndex ? (
                <td>
                  <Input
                    value={item}
                    onChange={(value: string) => {
                      itemChange(value, index);
                    }}
                    onEnter={() => {
                      setEditingIndex(-1);
                    }}
                    disabled={isLocked}
                  />
                </td>
              ) : (
                <td>
                  <span className="mx-2 text-lg">{item}</span>
                </td>
              )}
              <td>
                <Title text="Edit Entry" position="bottom">
                  <Button
                    classList="p-1.5 text-xs"
                    highlight={editingIndex === index}
                    onClick={() => {
                      setEditingIndex(index === editingIndex ? -1 : index);
                    }}
                    disabled={isLocked}
                  >
                    <BsFillPencilFill />
                  </Button>
                </Title>

                <Title text="Remove Entry" position="bottom">
                  <Button
                    classList="p-1.5 text-xs ml-1"
                    onClick={() => {
                      removeItem(index);
                    }}
                    disabled={isLocked}
                  >
                    <BsXLg />
                  </Button>
                </Title>
              </td>
            </tr>
          );
        })}
        <tr>
          <td colSpan={2}>
            <Input
              value={newItem}
              onChange={setNewItem}
              onEnter={addItem}
              disabled={isLocked}
              placeholder={placeholder}
            ></Input>
          </td>
          <td>
            <Title text="Add Entry" position="bottom">
              <Button classList="p-1.5 text-xs" onClick={addItem} disabled={isLocked}>
                <BsPlusLg />
              </Button>
            </Title>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
