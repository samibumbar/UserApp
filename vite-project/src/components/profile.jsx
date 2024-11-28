import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Divider,
  Collapse,
  Alert,
  TextField,
  Paper,
} from "@mui/material";
import { auth, db } from "./firebase";
import { signOut, updatePassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [detailsP, setDetailsP] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    navigate("/");
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      alert("A password reset link has been sent to your email.");
    } catch (error) {
      console.error("Error while resetting the password:", error.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        alert("Password successfully changed!");
      }
    } catch (error) {
      console.error("Error while changing the password:", error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #1d3557, #457b9d)",
        color: "#fff",
        padding: 0,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          height: "100%",
          maxWidth: "1200px",
          borderRadius: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: "linear-gradient(to right, #457b9d, #1d3557)",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "#fff",
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              border: "5px solid white",
              marginBottom: 2,
              backgroundColor: "#6a11cb",
            }}
            src="" // Link to user's profile picture (if available)
          >
            {userData ? userData.name[0].toUpperCase() : "U"}
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            {userData ? userData.name : "Loading..."}
          </Typography>
          <Typography variant="body1">
            {userData ? userData.email : ""}
          </Typography>
        </Box>

        {/* About Me Section */}
        <Box sx={{ padding: 4, flex: 1 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            About Me
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Date of Birth: {userData ? userData.birthdate : "Loading..."}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Description: Enthusiastic and dedicated web developer with a passion
            for creating user-friendly and responsive web applications. Skilled
            in modern frontend technologies and committed to delivering
            high-quality code.
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          {/* Reset Password & Logout */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowResetForm(!showResetForm)}
            >
              {showResetForm ? "Cancel Password Reset" : "Reset Password"}
            </Button>
            <Collapse in={showResetForm}>
              <Box
                sx={{
                  marginTop: 2,
                  padding: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  background: "#f8f8f8",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Reset Password
                </Typography>
                {detailsP && (
                  <Alert
                    severity="info"
                    sx={{ marginBottom: 2 }}
                    onClose={() => setDetailsP(false)}
                  >
                    If you ve forgotten your password, you can send a reset link
                    to your email address.
                  </Alert>
                )}
                <TextField
                  type="password"
                  fullWidth
                  label="New Password"
                  variant="outlined"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={handleChangePassword}
                >
                  Change Password
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ marginTop: 1 }}
                  onClick={handlePasswordReset}
                >
                  Send Reset Link
                </Button>
              </Box>
            </Collapse>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{ marginTop: 1 }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Profile;
