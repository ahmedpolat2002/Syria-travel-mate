"use client";
import React from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import styles from "./Contact.module.css";
import emailjs from "@emailjs/browser";

type FormInputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const Contact: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const result = await emailjs.send(
        "service_c6pekt5",
        "template_c83b95y",
        {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          to_email: "aosamajaml00@gmail.com",
        },
        "PuRTGi68LXSr1lXaJ"
      );

      if (result.text === "OK") {
        reset();
        alert("Thank you for your message!");
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Please try again later.");
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2>Contact Us</h2>
          <p>Get in touch with us for any inquiries or questions</p>
        </div>

        <div className={styles.contactWrapper}>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <FaMapMarkerAlt />
              </div>
              <div className={styles.contactText}>
                <h3>Our Location</h3>
                <p>123 Main Street, Damascus, Syria</p>
                <p>456 Second Street, Aleppo, Syria</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <FaPhoneAlt />
              </div>
              <div className={styles.contactText}>
                <h3>Phone Number</h3>
                <p>
                  <a href="tel:+963112345678">+963 11 234 5678</a>
                </p>
                <p>
                  <a href="tel:+963934567890">+963 93 456 7890</a>
                </p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <FaEnvelope />
              </div>
              <div className={styles.contactText}>
                <h3>Email Address</h3>
                <p>
                  <a href="mailto:info@travelmate-syria.com">
                    info@travelmate-syria.com
                  </a>
                </p>
                <p>
                  <a href="mailto:support@travelmate-syria.com">
                    support@travelmate-syria.com
                  </a>
                </p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <FaClock />
              </div>
              <div className={styles.contactText}>
                <h3> Opening Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday - Sunday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>

            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>
                <FaFacebookF />
              </a>
              <a href="#" className={styles.socialLink}>
                <FaTwitter />
              </a>
              <a href="#" className={styles.socialLink}>
                <FaInstagram />
              </a>
            </div>
          </div>

          <form
            className={styles.contactForm}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.formGroup}>
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                className={`${styles.formControl} ${
                  errors.name ? styles.error : ""
                }`}
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors.name && (
                <span className={styles.errorMessage}>
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                className={`${styles.formControl} ${
                  errors.email ? styles.error : ""
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className={styles.errorMessage}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                className={`${styles.formControl} ${
                  errors.subject ? styles.error : ""
                }`}
                {...register("subject", {
                  required: "Subject is required",
                  minLength: {
                    value: 3,
                    message: "Subject must be at least 3 characters long",
                  },
                })}
              />
              {errors.subject && (
                <span className={styles.errorMessage}>
                  {errors.subject.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                className={`${styles.formControl} ${styles.textarea} ${
                  errors.message ? styles.error : ""
                }`}
                {...register("message", {
                  required: "Message is required",
                  minLength: {
                    value: 10,
                    message: "Message must be at least 10 characters long",
                  },
                })}
              ></textarea>
              {errors.message && (
                <span className={styles.errorMessage}>
                  {errors.message.message}
                </span>
              )}
            </div>

            <button type="submit" className={styles.submitButton}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
