import { Pages } from "./const";

import Home from "../Pages/Home";
import AdUser from "../Pages/AdUser";
import AdGroup from "../Pages/AdGroup";
import AdComputer from "../Pages/AdComputer";
import AdReplication from "../Pages/AdReplication";
import WMI from "../Pages/WMI";
import AzureUser from "../Pages/AzureUser";
import AzureGroup from "../Pages/AzureGroup";
import AzureDevice from "../Pages/AzureDevice";
import Settings from "../Pages/Settings";
import Tetris from "../Pages/Tetris";
import QueryHelp from "../Components/Help/QueryHelp";
import AzureQueryHelp from "../Components/Help/AzureQueryHelp";
import TableHelp from "../Components/Help/TableHelp";
import SettingsHelp from "../Components/Help/SettingsHelp";
import History from "../Pages/History";
import UpdaterHelp from "../Components/Help/UpdaterHelp";

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
  BsJoystick,
  BsSearch,
  BsTable,
  BsDownload,
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
      href: `/${Pages.AdUser}`,
      text: "User",
      icon: <BsPersonLinesFill />,
      page: <AdUser />,
    },
    {
      href: `/${Pages.AdGroup}`,
      text: "Group",
      icon: <BsPeopleFill />,
      page: <AdGroup />,
    },
    {
      href: `/${Pages.AdComputer}`,
      text: "Computer",
      icon: <BsDisplay />,
      page: <AdComputer />,
    },
    {
      href: `/${Pages.AdReplication}`,
      text: "Replication",
      icon: <BsDiagram3Fill />,
      page: <AdReplication />,
    },
    {
      href: `/${Pages.Wmi}`,
      text: "WMI",
      icon: <BsCpu />,
      page: <WMI />,
    },
  ],
  [
    {
      href: `/${Pages.AzureUser}`,
      text: "Azure User",
      icon: <BsPersonLinesFill />,
      page: <AzureUser />,
    },
    {
      href: `/${Pages.AzureGroup}`,
      text: "Azure Group",
      icon: <BsPeopleFill />,
      page: <AzureGroup />,
    },
    {
      href: `/${Pages.AzureDevice}`,
      text: "Azure Device",
      icon: <BsLaptop />,
      page: <AzureDevice />,
    },
  ],
  [
    {
      href: `/${Pages.History}`,
      text: "History",
      icon: <BsClockHistory />,
      page: <History />,
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

export const helpNavigationLinks: NavigationLink[] = [
  {
    href: "#help/query",
    text: "Queries",
    icon: <BsSearch />,
    page: <QueryHelp />,
  },
  {
    href: "#help/azureQuery",
    text: "Azure Queries",
    icon: <BsSearch />,
    page: <AzureQueryHelp />,
  },
  {
    href: "#help/table",
    text: "Tables",
    icon: <BsTable />,
    page: <TableHelp />,
  },
  {
    href: "#help/settings",
    text: "Settings",
    icon: <BsGearFill />,
    page: <SettingsHelp />,
  },
  {
    href: "#help/updater",
    text: "Updater",
    icon: <BsDownload />,
    page: <UpdaterHelp />,
  },
];
