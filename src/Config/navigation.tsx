import UserPage from "../Pages/User";

import {
  BsClockHistory,
  BsCpu,
  BsDiagram3Fill,
  BsDisplay,
  BsFillMapFill,
  BsGearFill,
  BsLaptop,
  BsPeopleFill,
  BsPersonLinesFill,
  BsPrinterFill,
  BsSearch,
  BsServer,
} from "react-icons/bs";

type NavigationLinkMeta = {
  href: string;
  text: string;
  icon: React.ReactNode;
  page: React.ReactNode;
  isHidden?: boolean;
};
export const navigationLinks: NavigationLinkMeta[][] = [
  [
    {
      href: "/",
      text: "Home",
      icon: <BsFillMapFill />,
      page: <div>HomePage</div>,
      isHidden: true,
    },
    {
      href: "/search",
      text: "Search",
      icon: <BsSearch />,
      page: <div>SearchPage</div>,
    },
    {
      href: "/user",
      text: "User",
      icon: <BsPersonLinesFill />,
      page: <UserPage />,
    },
    {
      href: "/group",
      text: "Group",
      icon: <BsPeopleFill />,
      page: <div>GroupPage</div>,
    },
    {
      href: "/computer",
      text: "Computer",
      icon: <BsDisplay />,
      page: <div>ComputerPage</div>,
    },
    {
      href: "/replication",
      text: "Replication",
      icon: <BsDiagram3Fill />,
      page: <div>ReplicationPage</div>,
    },
  ],
  [
    {
      href: "/wmi",
      text: "WMI",
      icon: <BsCpu />,
      page: <div>WMIPage</div>,
    },
    {
      href: "/printer",
      text: "Printer",
      icon: <BsPrinterFill />,
      page: <div>PrinterPage</div>,
    },
    {
      href: "/dns",
      text: "DNS",
      icon: <BsServer />,
      page: <div>DnsPage</div>,
    },
  ],
  [
    {
      href: "/azureSearch",
      text: "Azure Search",
      icon: <BsSearch />,
      page: <div>AzureSearchPage</div>,
    },
    {
      href: "/azureUser",
      text: "Azure User",
      icon: <BsPersonLinesFill />,
      page: <div>AzureUserPage</div>,
    },
    {
      href: "/azureGroup",
      text: "Azure Group",
      icon: <BsPeopleFill />,
      page: <div>AzureGroupPage</div>,
    },
    {
      href: "/azureDevice",
      text: "Azure Device",
      icon: <BsLaptop />,
      page: <div>AzureDevicePage</div>,
    },
  ],
  [
    {
      href: "/history",
      text: "History",
      icon: <BsClockHistory />,
      page: <div>HistoryPage</div>,
    },
    {
      href: "/settings",
      text: "Settings",
      icon: <BsGearFill />,
      page: <div>SettingsPage</div>,
    },
  ],
];
