"use client";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface LikeButtonProps {
  placeId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ placeId }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error("Failed to fetch user:", err));
  }, []);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/likes/${placeId}`);
        const data = await res.json();
        setCount(data.count);
        setLiked(data.liked);
      } catch (err) {
        console.error("Failed to fetch likes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [placeId]);

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch(`/api/likes/${placeId}`, { method });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Action failed");
        return;
      }

      setLiked(!liked);
      setCount((prev) => prev + (liked ? -1 : 1));
    } catch (err) {
      console.error("Failed to toggle like:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {user ? (
        <button
          onClick={toggleLike}
          disabled={loading}
          style={{
            background: "none",
            border: "none",
            color: liked ? "red" : "gray",
            cursor: "pointer",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          <span>{count}</span>
        </button>
      ) : (
        <button
          onClick={() => setShowPopup(true)}
          style={{
            background: "none",
            border: "none",
            color: "gray",
            cursor: "pointer",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <FaRegHeart />
          <span>{count}</span>
        </button>
      )}

      {showPopup && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginTop: 0 }}>تنبيه</h3>
            <p>يرجى تسجيل الدخول لإبداء الإعجاب.</p>
            <div
              style={{
                marginTop: "1.5rem",
                textAlign: "right",
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontFamily: "var(--font-family-primary)",
                }}
              >
                إغلاق
              </button>
              <a
                href="/login"
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  textDecoration: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                تسجيل الدخول
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// أنماط النافذة المنبثقة
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "1.5rem",
  borderRadius: "8px",
  width: "400px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  direction: "rtl",
};

export default LikeButton;
