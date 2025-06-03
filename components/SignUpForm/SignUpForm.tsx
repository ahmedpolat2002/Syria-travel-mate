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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "فشل إنشاء الحساب");
      }

      setSuccessMessage("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
      setErrorMessage(null);

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage("فشل إنشاء الحساب : " + error.message);
      } else {
        setErrorMessage("حدث خطأ غير متوقع.");
      }
      setSuccessMessage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} dir="rtl">
      <h2>إنشاء حساب</h2>
      <p>
        لديك حساب؟{" "}
        <Link href="/login" className={styles.link}>
          تسجيل الدخول
        </Link>
      </p>

      {errorMessage && (
        <span className={styles.errorMessage}>{errorMessage}</span>
      )}
      {successMessage && (
        <span className={styles.successMessage}>{successMessage}</span>
      )}

      <label>اسم المستخدم</label>
      <input
        type="text"
        value={signupinputs.username}
        {...register("username", { required: "اسم المستخدم مطلوب" })}
        onChange={(e) =>
          setsignupinputs({ ...signupinputs, username: e.target.value })
        }
      />
      {errors.username && (
        <span className={styles.errorMessage}>{errors.username.message}</span>
      )}

      <label>البريد الإلكتروني</label>
      <input
        type="text"
        value={signupinputs.email}
        {...register("email", {
          required: "البريد الإلكتروني مطلوب",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "البريد الإلكتروني غير صالح",
          },
        })}
        onChange={(e) =>
          setsignupinputs({ ...signupinputs, email: e.target.value })
        }
      />
      {errors.email && (
        <span className={styles.errorMessage}>{errors.email.message}</span>
      )}

      <label>كلمة المرور</label>
      <div className={styles.passwordWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          value={signupinputs.password}
          {...register("password", {
            required: "كلمة المرور مطلوبة",
            minLength: {
              value: 8,
              message: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
            },
            pattern: {
              value: /^(?=.*[!@#$%^&*])(?=.*\d).+$/,
              message: "يجب أن تحتوي كلمة المرور على رمز خاص ورقم",
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
          إظهار
        </span>
      </div>
      {errors.password && (
        <span className={styles.errorMessage}>{errors.password.message}</span>
      )}

      <button type="submit" className={styles.loginButton}>
        إنشاء حساب
      </button>
    </form>
  );
};

export default SignUpForm;
