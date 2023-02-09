import { useEffect, useState } from "react";
import { useSessionStorage } from "../../Hooks/useStorage";
import Input from "../Input";

import Tab from "../Tab/Tab";
import TabControl from "../Tab/TabControl";
import Table from "../Table/Table";
import Draggable from "./Draggable";

type DesignerCSVProps = {
  name: string;
};
export default function DesignerCSV({ name }: DesignerCSVProps) {
  const [parsedData, setParsedData] = useState<Result<PSResult[]>>({ output: [] });
  const [data, setData] = useSessionStorage<DesignerData<string>>("designer_" + name, {
    posSize: { x: 10, y: 10, w: 500, h: 300 },
    value: "",
  });

  const getColumnDefinition = (object?: object[]) => {
    return Object.keys(object?.[0] || {}).map((column: string) => {
      return {
        title: column,
        key: column,
        sortable: true,
      };
    });
  };

  const CSVtoObject = (csv: string): Result<PSResult[]> => {
    try {
      const [headerLine, ...lines] = csv.split("\n");
      const parseLine = (line: string) => line.split(",");

      const headers = parseLine(headerLine);
      const objects = lines.map((line: string) =>
        parseLine(line).reduce(
          (object: object, value: string, index: number) => ({
            ...object,
            [headers[index]]: value,
          }),
          {},
        ),
      );

      return {
        output: objects
      };
    } catch (err) {
      return {
        output: [],
        error: "Error parsing CSV",
      };
    }
  };

  useEffect(() => {
    setParsedData(CSVtoObject(data.value));
  }, [data]);

  return (
    <Draggable
      title="CSV Input"
      posSize={data.posSize}
      onPosSizeChange={(posSize: PosSize) => setData({ posSize, value: data.value })}
    >
      <div className="my-3 mx-2">
        <TabControl>
          <Tab title="CSV">
            <Input
              isArea={true}
              value={data.value}
              onChange={(value: string) => setData({ value, posSize: data.posSize })}
              classOverride="h-64"
            />
          </Tab>
          <Tab title="Data">
            <Table
              isBasic={true}
              name={"designer_" + name + "_table"}
              columns={getColumnDefinition(parsedData.output)}
              data={parsedData}
            />
          </Tab>
        </TabControl>
      </div>
    </Draggable>
  );
}
