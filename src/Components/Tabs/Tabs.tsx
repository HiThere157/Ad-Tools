import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
import { addTab, setActiveTab, removeTab, moveTab } from "../../Redux/tabs";
import { defaultTab } from "../../Config/default";

import Tab from "./Tab";

import { BsPlus } from "react-icons/bs";
import { removeTabData } from "../../Redux/data";

type TabsProps = {
  page: string;
};
export default function Tabs({ page }: TabsProps) {
  const { activeTab, tabs } = useSelector((state: RootState) => state.tabs);
  const dispatch = useDispatch();

  const pageActiveTab = activeTab[page] ?? 0;
  const pageTabs = tabs[page] ?? [];

  const newTab = () => {
    const id = new Date().getTime();
    dispatch(addTab({ page, tab: { ...defaultTab, id } }));
    dispatch(setActiveTab({ page, tabId: id }));
  };

  const deleteTab = (tabId: number) => {
    dispatch(removeTab({ page, tabId }));
    dispatch(removeTabData({ page, tabId }));
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const { ctrlKey, key } = event;
    if (ctrlKey && key === "t") {
      newTab();
    }

    if (ctrlKey && key === "w") {
      const activeTabIndex = pageTabs.findIndex((tab) => tab.id === pageActiveTab);
      if (activeTabIndex) {
        deleteTab(pageActiveTab);
      }
    }
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const sourceTabId = event.dataTransfer.getData("text/plain");
    const targetTabId = (event.target as HTMLDivElement)
      .closest("[data-target-tab-id]")
      ?.getAttribute("data-target-tab-id");

    if (!targetTabId || sourceTabId === targetTabId) return;

    const sourceTabIndex = pageTabs.findIndex((tab) => tab.id.toString() === sourceTabId);
    const targetTabIndex = pageTabs.findIndex((tab) => tab.id.toString() === targetTabId);

    dispatch(
      moveTab({
        page,
        fromIndex: sourceTabIndex,
        toIndex: targetTabIndex == -1 ? pageTabs.length - 1 : targetTabIndex,
      }),
    );
  };

  // If there are no tabs, add a default tab
  if (pageTabs.length === 0) {
    newTab();
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pageTabs, pageActiveTab]);

  return (
    <div
      className="sticky top-0 z-30 flex flex-wrap items-center gap-0.5 bg-primary px-1 pt-0.5"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      data-target-tab-id={-1}
    >
      {pageTabs.map((tab, tabIndex) => (
        <Tab
          key={tabIndex}
          tab={tab}
          isActive={tab.id === pageActiveTab}
          onChange={() => dispatch(setActiveTab({ page, tabId: tab.id }))}
          onRemove={() => deleteTab(tab.id)}
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
