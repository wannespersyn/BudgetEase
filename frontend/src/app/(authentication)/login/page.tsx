'use client'

import { useState } from "react";
import styles from "../../../../styles/Login.module.css";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import AuthentiacationService from "../../../../services/AuthenticationService";
import Link from "next/link";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {
      email: !email.includes("@"),
      password: password.length < 6,
    };

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      console.log("Logging in:", { email, password });
    }

    const response = await AuthentiacationService.Login(email, password);
    if (!response.ok) {
      const errorData = response.json();
      console.error("Login failed:", errorData);
      alert("Login mislukt. Probeer het opnieuw.");
    } else {
      console.log("Login successful");
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      setTimeout(() => {
        alert("Login succesvol! Welkom terug.");
      }, 1000);
      window.location.href = "/";
    }
  };

  return (
    <main className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Login</h2>

        <div className={styles.inputContainer}>
          <label htmlFor="email">Email</label>
          <input
            className={errors.email ? styles.inputError : ""}
            type="email"
            placeholder="Type your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && (
            <p className={styles.errorMessage}>Please enter a valid email.</p>
          )}
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="password">Wachtwoord</label>
          <div className={styles.passwordWrapper}>
            <input
              className={errors.password ? styles.inputError : ""}
              type={showPassword ? "text" : "password"}
              placeholder="Wachtwoord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className={styles.errorMessage}>
              Password must be at least 6 characters.
            </p>
          )}
          <Link className={styles.forgotPassword} href="/register">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className={styles.loginButton}>Login</button>

        <div className={styles.registerLink}>
          <p>Don't have an account?</p>
          <Link href="/register">Register</Link>
        </div>
      </form>
    </main>
  );
}
