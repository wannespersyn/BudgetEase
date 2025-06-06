'use client'

import { useState } from "react";
import styles from "../../../../styles/Login.module.css";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {
      email: !email.includes("@"),
      password: password.length < 6,
    };

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      // proceed with login
      console.log("Logging in:", { email, password });
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
          <a className={styles.forgotPassword} href="/register">
            Forgot Password?
          </a>
        </div>

        <button type="submit" className={styles.loginButton}>Login</button>

        <div className={styles.registerLink}>
          <p>Don't have an account?</p>
          <a href="/register">Register</a>
        </div>
      </form>
    </main>
  );
}
