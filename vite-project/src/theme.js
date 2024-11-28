// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "linear-gradient(to right, #6a11cb, #2575fc)", // Fundal gradient
    },
    text: {
      primary: "#ffffff", // Text alb implicit
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif", // Font global
  },
});

export default theme;
