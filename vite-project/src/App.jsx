import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import PropTypes from "prop-types";
import Profile from "./components/profile";
import AuthForm from "./components/auth-form";
import Messages from "./components/messages";
import FriendsList from "./components/friends";
import Navbar from "./components/nav-bar";
import { auth } from "./components/firebase";
import ConversationList from "./components/conversation-list";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  if (loading) {
   
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router basename="/UserApp">
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        bgcolor="background.default"
        color="text.primary"
      >
        <RouteWrapper user={user} />
      </Box>
    </Router>
  );
}

function RouteWrapper({ user }) {
  const location = useLocation();
  const isMessagesPage =
    location.pathname.includes("/messages/") &&
    location.pathname !== "/messages/conversation-list";

  const renderRoutes = () => (
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/" />}
      />
      <Route
        path="/messages/:conversationId"
        element={user ? <Messages /> : <Navigate to="/" />}
      />
      <Route
        path="/messages/conversation-list"
        element={user ? <ConversationList /> : <Navigate to="/" />}
      />
      <Route
        path="/messages"
        element={
          user ? (
            <Navigate to="/messages/conversation-list" replace />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/friends"
        element={user ? <FriendsList /> : <Navigate to="/" />}
      />
    </Routes>
  );

  if (user && location.pathname === "/") {
    return <Navigate to="/messages/conversation-list" replace />;
  }

  return (
    <Box>
      {user && !isMessagesPage && <Navbar />}
      {renderRoutes()}
    </Box>
  );
}

/
RouteWrapper.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null]), 
  ]),
};

export default App;
