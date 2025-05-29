import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { FaPaperPlane, FaStar, FaUser } from "react-icons/fa";
import styles from "./Comments.module.css";
interface Comment {
  id: string;
  username: string;
  text: string;
  rating: number;
  date: Date;
}

interface CommentsProps {
  initialComments: Comment[];
  placeId: string;
  onAddComment?: (comment: {
    username: string;
    text: string;
    rating: number;
  }) => void;
}

const Comments: React.FC<CommentsProps> = ({
  initialComments,
  placeId,
  onAddComment,
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

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
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDelete = async (commentId: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا التعليق؟")) return;

    try {
      const res = await fetch(`/api/reviews/${placeId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setMessage("فشل في حذف التعليق");
        setMessageType("error");
        return;
      }

      setComments(comments.filter((c) => c.id !== commentId));
      setMessage("تم حذف التعليق بنجاح");
      setMessageType("success");
    } catch {
      setMessage("حدث خطأ أثناء حذف التعليق");
      setMessageType("error");
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
    setEditRating(comment.rating);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editText.trim() || editRating < 1) return;

    try {
      const res = await fetch(`/api/reviews/${placeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: editText, rating: editRating }),
      });

      if (!res.ok) {
        setMessage("فشل في تعديل التعليق");
        setMessageType("error");
        return;
      }

      setComments(
        comments.map((c) =>
          c.id === editingId ? { ...c, text: editText, rating: editRating } : c
        )
      );
      setEditingId(null);
      setEditText("");
      setEditRating(0);
      setMessage("تم تعديل التعليق بنجاح");
      setMessageType("success");
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user || rating < 1 || rating > 5) return;

    try {
      const res = await fetch(`/api/reviews/${placeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: text, rating }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "حدث خطأ أثناء إضافة التعليق");
        setMessageType("error");
        return;
      }

      const newComment = {
        id: crypto.randomUUID(),
        username: user.username,
        text,
        rating,
        date: new Date(),
      };

      setComments([newComment, ...comments]);
      setText("");
      setRating(0);

      if (onAddComment) {
        onAddComment(newComment);
      }
      setMessage("تمت إضافة التعليق بنجاح");
      setMessageType("success");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className={styles.commentsSection}>
      {message && (
        <div
          className={`${styles.message} ${
            messageType === "error" ? styles.error : styles.success
          }`}
        >
          {message}
        </div>
      )}

      {user ? (
        <form onSubmit={handleSubmit} className={styles.commentForm}>
          <div className={styles.formGroup}>
            <h3 className={styles.commentsTitle}>أضف تقييمك</h3>
            <div style={{ margin: "10px 0" }}>
              <StarRating initialRating={rating} onChange={setRating} />
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="أكتب تعليقك هنا..."
              className={styles.commentInput}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            إرسال <FaPaperPlane />
          </button>
        </form>
      ) : (
        <p className={styles.noComments}>
          أنت بحاجة إلى تسجيل الدخول لإضافة تعليق.
        </p>
      )}

      <h3 className={styles.commentsTitle}>التعليقات</h3>
      <div className={styles.commentsList}>
        {comments.map((c) => (
          <div key={c.id} className={styles.comment}>
            <div className={styles.commentHeader}>
              <div className={styles.userAvatar}>
                <FaUser />
              </div>
              <div className={styles.commentMeta}>
                <h4 className={styles.username}>{c.username}</h4>
                <span className={styles.date}>{formatDate(c.date)}</span>
              </div>
            </div>

            {editingId === c.id ? (
              <form onSubmit={handleEditSubmit} className={styles.editForm}>
                <StarRating
                  initialRating={editRating}
                  onChange={setEditRating}
                />
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className={styles.commentInput}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" className={styles.submitButton}>
                    حفظ
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className={styles.cancelButton}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.commentText}>
                <div style={{ color: "gold" }}>
                  {[...Array(c.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p>{c.text}</p>

                {/* need css jaml */}
                {user?.username === c.username && (
                  <div className={styles.commentActions}>
                    <button
                      onClick={() => handleEdit(c)}
                      className={styles.editBtn}
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className={styles.deleteBtn}
                    >
                      حذف
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
