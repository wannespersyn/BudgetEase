'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../../../../styles/Register.module.css"
import AuthentiacationService from "../../../../services/AuthenticationService";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ name: false, email: false, password: false });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: name.trim().length < 2,
      email: !email.includes("@"),
      password: password.length < 6,
    };

    setErrors(newErrors);

    const response = await AuthentiacationService.Register(name, email, password);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Registration failed:", errorData);
      alert("Registratie mislukt. Probeer het opnieuw.");
      
    } else {
      console.log("Registration successful");
      setTimeout(() => {
        alert("Registratie succesvol! Je kunt nu inloggen.");
      }, 1000);
      router.push("/login");
    }
  };

  return (
    <main className={styles.registerPage}>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <h2>Register</h2>

        <div className={styles.inputContainer}>
          <label htmlFor="name">Naam</label>
          <input
            className={errors.name ? styles.inputError : ""}
            type="text"
            placeholder="Naam"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p className={styles.errorMessage}>Naam is te kort.</p>}
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="email">E-mailadres</label>
          <input
            className={errors.email ? styles.inputError : ""}
            type="email"
            placeholder="E-mailadres"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className={styles.errorMessage}>E-mailadres is ongeldig.</p>}
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
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className={styles.errorMessage}>Minstens 6 tekens vereist.</p>
          )}
        </div>

        <button type="submit" className={styles.RegisterButton}>Register</button>
        
        <p className={styles.loginPrompt}>
          Heb je al een account? <Link href="/login">Log in hier</Link>.
        </p>

        <p className={styles.privacyPolicy}>
          Door je te registreren ga je akkoord met onze <Link href="/#">privacy policy</Link>.
        </p>
      </form>
    </main>
  );
}
