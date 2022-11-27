import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { GlobalStateProvider } from "./Hooks/useGlobalState";

import RootLayout from "./Layouts/RootLayout";
import SearchPage from "./Pages/Search";
import UserPage from "./Pages/User";
import GroupPage from "./Pages/Group";
import ComputerPage from "./Pages/Computer";
import AzureUserPage from "./Pages/AzureUser";
import AzureGroupPage from "./Pages/AzureGroup";
import DnsPage from "./Pages/DNS";
import HistoryPage from "./Pages/History";
import SettingsPage from "./Pages/Settings";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <HashRouter>
        <RootLayout>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/group" element={<GroupPage />} />
            <Route path="/computer" element={<ComputerPage />} />
            <Route path="/azureUser" element={<AzureUserPage />} />
            <Route path="/azureGroup" element={<AzureGroupPage />} />
            <Route path="/dns" element={<DnsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </RootLayout>
      </HashRouter>
    </GlobalStateProvider>
  </React.StrictMode>
);

// TODO:
// - Error Message popup
// - Settings (Set domain values / defaul to connected/trusted?)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
