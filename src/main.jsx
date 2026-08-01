import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ProjectZero from "./Projectzerolanding.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProjectZero />
  </StrictMode>,
);
