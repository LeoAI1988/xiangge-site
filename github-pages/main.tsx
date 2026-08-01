import React from "react";
import { createRoot } from "react-dom/client";
import { LandingPage } from "../components/LandingPage";
import "../app/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("GitHub Pages root element is missing");
}

createRoot(root).render(
  <React.StrictMode>
    <LandingPage />
  </React.StrictMode>,
);
