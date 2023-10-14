import { useDispatch, useSelector } from "react-redux";

import { getPageState } from "../../Helper/utils";
import { RootState } from "../../Redux/store";
import { defaultTab } from "../../Config/default";
import { addTab, changeActiveTab, removeTab } from "../../Redux/tabs";

import Tab from "./Tab";

import { BsPlus } from "react-icons/bs";

type TabsProps = {
  page: string;
};
export default function Tabs({ page }: TabsProps) {
  const { activeTab, tabs } = useSelector((state: RootState) => getPageState(state.tabs, page));
  const dispatch = useDispatch();

  if (!tabs) {
    const id = new Date().getTime();
    dispatch(addTab({ page, tab: { ...defaultTab, id } }));
    dispatch(changeActiveTab({ page, tabId: id }));
  }

  return (
    <div className="sticky top-0 z-50 flex h-8 flex-wrap items-center gap-0.5 bg-primary px-1 pt-1">
      {tabs?.map((tab, tabIndex) => (
        <Tab
          key={tabIndex}
          tab={tab}
          isActive={tab.id === activeTab}
          onChange={() => dispatch(changeActiveTab({ page, tabId: tab.id }))}
          onRemove={() => dispatch(removeTab({ page, tabId: tab.id }))}
        />
      ))}

      <button
        className="mx-1 rounded-full text-xl hover:bg-secondaryActive active:bg-primary"
        onClick={() => {
          const id = new Date().getTime();
          dispatch(addTab({ page, tab: { ...defaultTab, id } }));
        }}
      >
        <BsPlus />
      </button>
    </div>
  );
}
