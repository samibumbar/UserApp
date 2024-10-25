import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Router basename="/UserApp">
        {user && <Navbar />}
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
                <Navigate to="/messages/conversation-list" />
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
      </Router>
    </div>
  );
}

export default App;
