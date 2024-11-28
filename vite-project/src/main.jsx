import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material"; // Import ThemeProvider și CssBaseline
import App from "./App";
import theme from "./theme"; // Import tema creată

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Aplică fundalul și resetează stilurile */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
