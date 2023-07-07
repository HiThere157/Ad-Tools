import { useState } from "react";

import { useSessionStorage } from "../../Hooks/useStorage";
import { defaultTableConfig } from "../../Config/default";

import TableHeader from "./TableHeader";
import Pagination from "./Pagination";
import Button from "../Button";

import { BsLayoutThreeColumns, BsFunnel, BsClipboard } from "react-icons/bs";
import TableElement from "./TableElement";

type TableProps = {
  id: string;
  title: string;
  result: Loadable<PSResult>;
};
export default function Table({ id, title, result }: TableProps) {
  const [config, setConfig] = useSessionStorage<TableConfig>(id, defaultTableConfig);
  const [count, setCount] = useState<TableCount>({
    total: 0,
    selected: 0,
    filtered: 0,
  });

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
            <Button theme="secondary" className="h-7 px-1" onClick={() => {}}>
              <BsClipboard />
            </Button>
          </div>

          <TableElement
            result={result}
            config={config}
            setConfig={setConfig}
            setCount={setCount}
          />

          <Pagination
            total={result?.data?.length ?? 0}
            pagination={config.pagination}
            setPagination={(pagination) => setConfig({ ...config, pagination })}
          />
        </div>
      )}
    </section>
  );
}
