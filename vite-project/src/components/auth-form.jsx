import React, { useState, useEffect } from "react";
import "./auth.css";
import { auth, db } from "./firebase.jsx";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      navigate("/messages");
    }
  }, [navigate]);

  const handleAuth = async (values) => {
    const { email, password, name, birthdate } = values;

    if (isSignUp) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          name,
          birthdate,
          email,
        });

        await sendEmailVerification(user);
        toast.success(
          "Account created successfully! Check your email for confirmation."
        );
        navigate("/");
      } catch (error) {
        toast.error(`Registration error: ${error.message}`);
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
          toast.error("Please verify your email before logging in.");
          return;
        }

        toast.success("Successfully logged in!");
        navigate("/profile");
      } catch (error) {
        if (error.code === "auth/wrong-password") {
          toast.error("Incorrect password. Please try again.");
        } else if (error.code === "auth/user-not-found") {
          toast.error("No user found with this email.");
        } else {
          toast.error(`Login error: ${error.message}`);
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Creăm profilul dacă nu există deja
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          birthdate: "",
        });
      }

      toast.success("Successfully logged in with Google!");
      navigate("/messages");
    } catch (error) {
      toast.error(`Google Sign-In error: ${error.message}`);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>{isSignUp ? "Create an account" : "Login"}</h2>
        <Formik
          initialValues={{ email: "", password: "", name: "", birthdate: "" }}
          validationSchema={
            isSignUp ? validationSchemaSignUp : validationSchemaLogin
          }
          onSubmit={handleAuth}
        >
          {({ isSubmitting }) => (
            <Form>
              {isSignUp && (
                <>
                  <div>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Your name"
                      aria-label="Name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div>
                    <Field
                      type="date"
                      name="birthdate"
                      aria-label="Birthdate"
                    />
                    <ErrorMessage
                      name="birthdate"
                      component="div"
                      className="error"
                    />
                  </div>
                </>
              )}
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  aria-label="Email"
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  aria-label="Password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Submitting..."
                  : isSignUp
                  ? "Sign Up"
                  : "Login"}
              </button>
              <button className="google-sign-in" onClick={handleGoogleSignIn}>
                <i className="fa-brands fa-google"></i>
                oogle login
              </button>
              <p onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </p>
            </Form>
          )}
        </Formik>

        <ToastContainer />
      </div>
    </div>
  );
}

export default AuthForm;
