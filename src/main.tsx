import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

import store from "./Redux/store";
import { navigationLinks } from "./Config/navigation";

import RootLayout from "./Layout/Root";

import "./index.css";
import "./scrollbar.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <HashRouter>
          <RootLayout>
            <Routes>
              {navigationLinks.flat().map((link, linkIndex) => (
                <Route key={linkIndex} path={link.href} element={link.page} />
              ))}
            </Routes>
          </RootLayout>
        </HashRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
