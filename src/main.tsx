import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/about" element={<div>About</div>} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
