import { useState, useEffect } from "react";

import Button from "./Button";
import Input from "./Input";
import Title from "./Title";

import { BsXLg, BsFillPencilFill, BsPlusLg } from "react-icons/bs";

type EditableObjectProps = {
  object: { [key: string]: string };
  onChange: Function;
  isLocked?: boolean;
  placeholder?: { key: string; value: string };
};
export default function EditableObject({
  object,
  onChange,
  isLocked = false,
  placeholder,
}: EditableObjectProps) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);

  const attribChange = (key: string, value: string) => {
    const newObject = { ...object };
    newObject[key] = value;
    onChange(newObject);
  };

  const keyChange = (oldKey: string, newKey: string) => {
    const entries = Object.entries(object).map(([key, value]) => [
      key === oldKey ? newKey : key,
      value,
    ]);
    onChange(Object.fromEntries(entries));
  };

  const removeAttrib = (key: string) => {
    const entries = Object.entries(object).filter(([attrib]) => attrib !== key);
    onChange(Object.fromEntries(entries));
  };

  const addAttrib = () => {
    onChange({ ...object, [newKey]: newValue });
    setNewKey("");
    setNewValue("");
  };

  useEffect(() => {
    if (isLocked) setEditingIndex(-1);
  }, [isLocked]);

  return (
    <table className="border-separate border-spacing-1">
      <tbody>
        {Object.entries(object).map(([key, value], index) => {
          return (
            <tr key={index}>
              {index === editingIndex ? (
                <>
                  <td>
                    <Input
                      value={key}
                      onChange={(value: string) => {
                        keyChange(key, value);
                      }}
                      disabled={isLocked}
                    />
                  </td>
                  <td>
                    <span className="text-foregroundAccent mx-2">:</span>
                  </td>
                  <td>
                    <Input
                      value={value}
                      onChange={(value: string) => {
                        attribChange(key, value);
                      }}
                      disabled={isLocked}
                    />
                  </td>
                </>
              ) : (
                <>
                  <td className="text-end">
                    <span>{key}</span>
                  </td>
                  <td>
                    <span className="text-foregroundAccent mx-2">:</span>
                  </td>
                  <td>
                    <span>{value}</span>
                  </td>
                </>
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
                      removeAttrib(key);
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
          <td>
            <Input
              value={newKey}
              onChange={setNewKey}
              onEnter={addAttrib}
              disabled={isLocked}
              placeholder={placeholder?.key}
            />
          </td>
          <td>
            <span className="text-foregroundAccent mx-2">:</span>
          </td>
          <td>
            <Input
              value={newValue}
              onChange={setNewValue}
              onEnter={addAttrib}
              disabled={isLocked}
              placeholder={placeholder?.value}
            />
          </td>
          <td className="flex">
            <Title text="Add Entry" position="bottom">
              <Button classList="p-1.5 text-xs" onClick={addAttrib} disabled={isLocked}>
                <BsPlusLg />
              </Button>
            </Title>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
