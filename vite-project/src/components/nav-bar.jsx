import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Chat, AccountCircle, People } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <AppBar position="sticky" sx={{ background: "#6a11cb" }}>
      <Toolbar>
        {/* Center Section: Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          TalkNest
        </Typography>

        {/* Right Section: Navigation Buttons */}
        <Box>
          <Button
            color="inherit"
            startIcon={<Chat />}
            onClick={() => handleNavigate("/messages/conversation-list")}
          >
            Messages
          </Button>
          <Button
            color="inherit"
            startIcon={<People />}
            onClick={() => handleNavigate("/friends")}
          >
            Friends
          </Button>
          <Button
            color="inherit"
            startIcon={<AccountCircle />}
            onClick={() => handleNavigate("/profile")}
          >
            Profile
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
