import React, { useState, useEffect } from "react";
import "./profile.css";
import { auth, db } from "./firebase";
import { signOut, updatePassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [userAbout, setUserAbout] = useState(false);

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
    alert("Te-ai delogat cu succes!");
    navigate("/");
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      alert("Link-ul pentru resetarea parolei a fost trimis.");
    } catch (error) {
      console.error("Error la resetarea parolei:", error.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        alert("Parola a fost schimbată cu succes!");
      }
    } catch (error) {
      console.error("Error la schimbarea parolei:", error.message);
    }
  };

  const toggleResetForm = () => {
    setShowResetForm(!showResetForm);
  };
  const detailsPasswordChangev = () => {
    setDetailsP(!detailsP);
  };
  const handleAboutToggle = () => {
    setUserAbout(!userAbout);
  };
  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-photo">Your</div>
      <button className="user-details" onClick={handleAboutToggle}>
        About-Me
      </button>
      {userAbout && (
        <div>
          {userData && (
            <div>
              <p>Nume: {userData.name}</p>
              <p>Data nașterii: {userData.birthdate}</p>
              <p>Email: {userData.email}</p>
            </div>
          )}{" "}
        </div>
      )}

      <div className="profile-buttons">
        <button className="reset-password-btn" onClick={toggleResetForm}>
          {showResetForm ? "cancel" : "Reset Password"}
        </button>
        <button className="log-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {showResetForm && (
        <div className="resset-pasword-container">
          <div className="title-resset">
            <h3>Reset Password</h3>
            <p onClick={detailsPasswordChangev}>More</p>
          </div>
          {detailsP && (
            <div className="details-password">
              <p>
                If you've forgotten your password, don't worry! You can easily
                reset it by clicking the "Send Reset Link" button. A password
                reset link will be sent to your email, allowing you to create a
                new password and regain access to your account.
              </p>
            </div>
          )}
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Introdu noua parolă"
          />
          <button onClick={handleChangePassword}>Schimbă parola</button>
          <button onClick={handlePasswordReset}>
            Trimite link pentru resetare
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
