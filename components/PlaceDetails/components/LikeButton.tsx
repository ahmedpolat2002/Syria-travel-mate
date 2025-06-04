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

  // جلب عدد الإعجابات وحالة المستخدم
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
          onClick={() => alert("يرجى تسجيل الدخول لإبداء الإعجاب")}
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
    </>
  );
};

export default LikeButton;
