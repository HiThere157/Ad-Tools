import Home from "../Pages/Home";
import AdUser from "../Pages/AdUser";
import AdGroup from "../Pages/AdGroup";
import AdComputer from "../Pages/AdComputer";
import AzureUser from "../Pages/AzureUser";
import AzureGroup from "../Pages/AzureGroup";
import AzureDevice from "../Pages/AzureDevice";
import Settings from "../Pages/Settings";
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
      href: "/adUser",
      text: "User",
      icon: <BsPersonLinesFill />,
      page: <AdUser />,
    },
    {
      href: "/adGroup",
      text: "Group",
      icon: <BsPeopleFill />,
      page: <AdGroup />,
    },
    {
      href: "/adComputer",
      text: "Computer",
      icon: <BsDisplay />,
      page: <AdComputer />,
    },
    {
      href: "/adReplication",
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
      page: <AzureUser />,
    },
    {
      href: "/azureGroup",
      text: "Azure Group",
      icon: <BsPeopleFill />,
      page: <AzureGroup />,
    },
    {
      href: "/azureDevice",
      text: "Azure Device",
      icon: <BsLaptop />,
      page: <AzureDevice />,
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
      page: <Settings />,
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
