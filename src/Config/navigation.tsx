import Home from "../Pages/Home";
import User from "../Pages/User";
import Tetris from "../Pages/Tetris";

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
  BsServer,
  BsJoystick,
} from "react-icons/bs";

export const navigationLinks: NavigationLink[][] = [
  [
    {
      href: "/",
      text: "Home",
      icon: <BsFillMapFill />,
      page: <Home />,
      isHidden: true,
    },
    {
      href: "/user",
      text: "User",
      icon: <BsPersonLinesFill />,
      page: <User />,
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
  [
    {
      href: "/tetris",
      text: "Tetris",
      icon: <BsJoystick />,
      page: <Tetris />,
      isHidden: true,
      isEasterEgg: true,
    },
  ],
];
