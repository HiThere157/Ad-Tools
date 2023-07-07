import { useState } from "react";

import { useSessionStorage } from "../../Hooks/useStorage";
import { defaultTableConfig, defaultTableCount } from "../../Config/default";

import TableHeader from "./TableHeader";
import Pagination from "./Pagination";
import TableElement from "./TableElement";
import Dropdown from "../Dropdown/Dropdown";
import Button from "../Button";

import { BsLayoutThreeColumns, BsFunnel, BsClipboard } from "react-icons/bs";

type TableProps = {
  id: string;
  title: string;
  result: Loadable<PSResult>;
};
export default function Table({ id, title, result }: TableProps) {
  const [config, setConfig] = useSessionStorage<TableConfig>(id, defaultTableConfig);
  const [count, setCount] = useState<TableCount>(defaultTableCount);

  config.selectedColumns = ["test", "test", "test", "test", "test", "test"];

  return (
    <section>
      <TableHeader
        title={title}
        count={count}
        isCollapsed={config.isCollapsed}
        setIsCollapsed={(isCollapsed) => setConfig({ ...config, isCollapsed })}
      />

      {!config.isCollapsed && (
        <div className="flex w-fit flex-col gap-1 px-2">
          <div className="flex items-center gap-1">
            <Pagination
              total={result?.data?.length ?? 0}
              pagination={config.pagination}
              setPagination={(pagination) => setConfig({ ...config, pagination })}
            />

            <div className="min-w-[5rem] flex-1" />

            <Button theme="secondary" className="h-7 px-1" onClick={() => {}}>
              <BsLayoutThreeColumns />
            </Button>
            <Button theme="secondary" className="h-7 px-1" onClick={() => {}}>
              <BsFunnel />
            </Button>
            <Dropdown
              className="h-7 px-1"
              items={["Copy All", "Copy Selection"]}
              onChange={() => {}}
            >
              <BsClipboard />
            </Dropdown>
          </div>

          <TableElement
            result={result}
            config={config}
            setConfig={setConfig}
            setCount={setCount}
          />
        </div>
      )}
    </section>
  );
}
