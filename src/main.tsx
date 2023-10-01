import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import { navigationLinks } from "./Config/navigation";

import RootLayout from "./Layout/Root";

import "./index.css";
import "./scrollbar.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <RootLayout>
        <Routes>
          {navigationLinks.flat().map((link, linkIndex) => (
            <Route key={linkIndex} path={link.href} element={link.page} />
          ))}
        </Routes>
      </RootLayout>
    </HashRouter>
  </React.StrictMode>,
);
