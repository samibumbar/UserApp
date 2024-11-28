import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { auth, db } from "./firebase.jsx";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const validationSchemaSignUp = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[0-9]/, "Password must contain a number")
    .matches(/[!@#$%^&*]/, "Password must contain a special character")
    .required("Password is required"),
  name: Yup.string().required("Name is required"),
  birthdate: Yup.date().required("Birthdate is required"),
});

const validationSchemaLogin = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      if (!user.emailVerified) {
        setSnackbar({
          open: true,
          message: "Please verify your email to access the application.",
          severity: "warning",
        });
        auth.signOut(); // Delogare automată
        return;
      }
      navigate("/messages");
    }
  }, [navigate]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAuth = async (values) => {
    const { email, password, name, birthdate } = values;
    setLoading(true);

    if (isSignUp) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), { name, birthdate, email });

        // Trimitere email de verificare
        await sendEmailVerification(user);
        setSnackbar({
          open: true,
          message:
            "Account created successfully! Please check your email for confirmation.",
          severity: "info",
        });
        auth.signOut(); // Delogare automată
        setIsSignUp(false); // Comutăm la formularul de login
        navigate("/"); // Navigăm către login
      } catch (error) {
        // Gestionare eroare pentru email deja folosit
        if (error.code === "auth/email-already-in-use") {
          setSnackbar({
            open: true,
            message: "This email is already in use. Please log in instead.",
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: `Registration error: ${error.message}`,
            severity: "error",
          });
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        if (!user.emailVerified) {
          setSnackbar({
            open: true,
            message: "Please verify your email before logging in.",
            severity: "error",
          });
          auth.signOut(); // Delogare automată
          return;
        }

        setSnackbar({
          open: true,
          message: "Successfully logged in!",
          severity: "success",
        });
        navigate("/messages");
      } catch (error) {
        setSnackbar({
          open: true,
          message:
            error.code === "auth/wrong-password"
              ? "Incorrect password. Please try again."
              : error.code === "auth/user-not-found"
              ? "No user found with this email."
              : `Login error: ${error.message}`,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1f4037, #99f2c8, #38b5f3, #6a11cb)",
        backgroundSize: "400% 400%",
        animation: "gradientAnimation 15s ease infinite",
      }}
    >
      <style>
        {`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Grid item xs={12} sm={8} md={4}>
        <Paper
          elevation={10}
          style={{
            padding: "32px",
            borderRadius: "16px",
            textAlign: "center",
            backdropFilter: "blur(20px)",
            background: "rgba(255, 255, 255, 0.2)",
            boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography
            variant="h5"
            style={{ fontWeight: "bold", color: "#6a11cb" }}
          >
            {isSignUp ? "Create an Account" : "Login"}
          </Typography>
          <Formik
            initialValues={{
              email: "",
              password: "",
              name: "",
              birthdate: "",
            }}
            validationSchema={
              isSignUp ? validationSchemaSignUp : validationSchemaLogin
            }
            onSubmit={handleAuth}
          >
            {({ errors, touched }) => (
              <Form>
                <Box display="flex" flexDirection="column" gap={2}>
                  {isSignUp && (
                    <>
                      <Field
                        as={TextField}
                        name="name"
                        label="Name"
                        fullWidth
                        variant="outlined"
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                      <Field
                        as={TextField}
                        name="birthdate"
                        label="Birthdate"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        error={touched.birthdate && Boolean(errors.birthdate)}
                        helperText={touched.birthdate && errors.birthdate}
                      />
                    </>
                  )}
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : isSignUp ? (
                      "Sign Up"
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <Typography
                    variant="body2"
                    style={{
                      marginTop: "16px",
                      cursor: "pointer",
                      color: "#6a11cb",
                    }}
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp
                      ? "Already have an account? Login"
                      : "Don't have an account? Register"}
                  </Typography>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AuthForm;
