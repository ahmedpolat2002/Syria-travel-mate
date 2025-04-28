"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./LoginForm.module.css";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

type LoginFormInputs = {
  username: string;
  password: string;
};

type TokenPayload = {
  id: number;
  username: string;
  role: string;
};

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const [logininputs, setlogininputs] = useState({
    username: "",
    password: "",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          usernameOrEmail: data.username, // ✨ هنا نرسله باسم usernameOrEmail
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const result = await response.json();

      console.log("Login successful:", result);

      // ✨ فك التوكن
      const decoded = jwtDecode<TokenPayload>(result.token);

      // ✨ تحقق من الدور وعمل التوجيه
      if (decoded.role === "admin") {
        window.location.href = "/admin"; // إعادة توجيه للوحة تحكم الأدمن مثلاً
      } else {
        window.location.href = "/"; // إعادة توجيه مثلاً للصفحة الرئيسية
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
      } else {
        console.error("Login error:", error);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2>Log in</h2>
        <p>
          Need a Mailchimp account?{" "}
          <Link href="/register" className={styles.link}>
            Create an account
          </Link>
        </p>

        <label>Username or Email</label>
        <input
          value={logininputs.username}
          type="text"
          {...register("username", { required: "This field is required" })}
          onChange={(e) => {
            setlogininputs({ ...logininputs, username: e.target.value });
          }}
        />
        {errors.username && (
          <p className={styles.error}>{errors.username.message}</p>
        )}

        <label>Password</label>
        <div className={styles.passwordWrapper}>
          <input
            value={logininputs.password}
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
            onChange={(e) => {
              setlogininputs({ ...logininputs, password: e.target.value });
            }}
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
          Log in
        </button>
      </form>
    </>
  );
};

export default LoginForm;
