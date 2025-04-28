"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./SignUpForm.module.css";
import Link from "next/link";

type SignUpFormInputs = {
  username: string;
  email: string;
  password: string;
};

const SignUpForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const [signupinputs, setsignupinputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      setSuccessMessage("Account created successfully! You can now log in.");
      setErrorMessage(null);

      // اختياري: إعادة توجيه المستخدم لصفحة تسجيل الدخول بعد النجاح
      // مثلا بعد 2 ثانية
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
      setSuccessMessage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div>
        <h2>Sign Up</h2>
        <p>
          Do you have account?{" "}
          <Link href="/login" className={styles.link}>
            I have account
          </Link>
        </p>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        <label>Username</label>
        <input
          value={signupinputs.username}
          type="text"
          {...register("username", { required: "Username is required" })}
          onChange={(e) =>
            setsignupinputs({ ...signupinputs, username: e.target.value })
          }
        />
        {errors.username && (
          <p className={styles.error}>{errors.username.message}</p>
        )}

        <label>Email</label>
        <input
          type="text"
          value={signupinputs.email}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          onChange={(e) =>
            setsignupinputs({ ...signupinputs, email: e.target.value })
          }
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <label>Password</label>
        <div className={styles.passwordWrapper}>
          <input
            value={signupinputs.password}
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[!@#$%^&*])(?=.*\d).+$/,
                message:
                  "Password must contain at least one special character and one number",
              },
            })}
            onChange={(e) =>
              setsignupinputs({ ...signupinputs, password: e.target.value })
            }
          />
          <span
            className={styles.show}
            onMouseEnter={() => setShowPassword(true)}
            onMouseLeave={() => setShowPassword(false)}
          >
            Show
          </span>
        </div>
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}

        <button type="submit" className={styles.loginButton}>
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
