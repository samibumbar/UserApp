
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "linear-gradient(to right, #6a11cb, #2575fc)", 
    },
    text: {
      primary: "#ffffff", 
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif", 
  },
});

export default theme;
