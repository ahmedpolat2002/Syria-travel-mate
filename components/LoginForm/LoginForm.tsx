"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./LoginForm.module.css";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          usernameOrEmail: data.username,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage({
          text: "فشل تسجيل الدخول" + " " + (errorData.error || ""),
          type: "error",
        });
        return;
      }

      const result = await response.json();
      const decoded = jwtDecode<TokenPayload>(result.token);

      setMessage({ text: "تم تسجيل الدخول بنجاح", type: "success" });

      setTimeout(() => {
        if (decoded.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 1500);
    } catch {
      setMessage({ text: "حدث خطأ أثناء تسجيل الدخول", type: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} dir="rtl">
      <h2>تسجيل الدخول</h2>
      <p>
        لا تملك حساباً؟{" "}
        <Link href="/register" className={styles.link}>
          إنشاء حساب جديد
        </Link>
      </p>

      {message && (
        <span
          className={
            message.type === "error"
              ? styles.errorMessage
              : styles.successMessage
          }
        >
          {message.text}
        </span>
      )}

      <label>اسم المستخدم أو البريد الإلكتروني</label>
      <input
        type="text"
        value={logininputs.username}
        {...register("username", { required: "هذا الحقل مطلوب" })}
        onChange={(e) =>
          setlogininputs({ ...logininputs, username: e.target.value })
        }
      />
      {errors.username && (
        <span className={styles.error}>{errors.username.message}</span>
      )}

      <label>كلمة المرور</label>
      <div className={styles.passwordWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          value={logininputs.password}
          {...register("password", {
            required: "كلمة المرور مطلوبة",
            minLength: {
              value: 8,
              message: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
            },
            pattern: {
              value: /^(?=.*[!@#$%^&*])(?=.*\d).+$/,
              message: "يجب أن تحتوي كلمة المرور على رقم ورمز خاص على الأقل",
            },
          })}
          onChange={(e) =>
            setlogininputs({ ...logininputs, password: e.target.value })
          }
        />
        <span
          className={styles.show}
          onMouseEnter={() => setShowPassword(true)}
          onMouseLeave={() => setShowPassword(false)}
        >
          إظهار
        </span>
      </div>
      {errors.password && (
        <span className={styles.error}>{errors.password.message}</span>
      )}

      <button type="submit" className={styles.loginButton}>
        تسجيل الدخول
      </button>
    </form>
  );
};

export default LoginForm;
