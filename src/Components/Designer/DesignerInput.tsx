import { useSessionStorage } from "../../Hooks/useStorage";

import Input from "../Input";
import Draggable from "./Draggable";

type DesignerInputIProps = {
  name: string;
};
export default function DesignerInput({ name }: DesignerInputIProps) {
  const [data, setData] = useSessionStorage<DesignerData<string>>("designer_" + name, {
    posSize: { x: 10, y: 10, w: 200, h: 90 },
    value: "",
  });

  return (
    <Draggable
      title="Text Input"
      canResize={false}
      posSize={data.posSize}
      onPosSizeChange={(posSize: PosSize) => setData({ posSize, value: data.value })}
    >
      <div className="my-3 mx-2">
        <Input
          label="Value:"
          value={data.value}
          onChange={(value: string) => setData({ value, posSize: data.posSize })}
        />
      </div>
    </Draggable>
  );
}
