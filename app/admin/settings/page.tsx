"use client";

import { useEffect, useState } from "react";
import styles from "./UsersPage.module.css";
import toast from "react-hot-toast";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [editingUsername, setEditingUsername] = useState("");

  useEffect(() => {
    // جلب المستخدمين من API
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));

    // جلب المستخدم الحالي (من جلسة أو API مخصصة)
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          console.log("User is authenticated:", data.user);
          setCurrentUserId(data.user.id);
          setEditingUsername(data.user.username);
        }
      });
  }, []);

  const handleRoleChange = async (id: number, newRole: string) => {
    await fetch("/api/users", {
      method: "PUT",
      body: JSON.stringify({ id, role: newRole }),
      headers: { "Content-Type": "application/json" },
    });
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  const handleUsernameUpdate = async () => {
    if (!currentUserId) return;
    await fetch("/api/users", {
      method: "PUT",
      body: JSON.stringify({ id: currentUserId, username: editingUsername }),
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        toast.success("تم تحديث الاسم بنجاح");
        setUsers((prev) =>
          prev.map((u) =>
            u.id === currentUserId ? { ...u, username: editingUsername } : u
          )
        );
        setEditingUsername(editingUsername);
      })
      .catch(() => {
        toast.error("حدث خطأ أثناء تحديث الاسم");
      });
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  // if (users.length === 0) {
  //   return <div className={styles.loading}>جارٍ تحميل المستخدمين...</div>;
  // }

  return (
    <div className={styles.container}>
      <h1>إدارة المستخدمين</h1>

      <input
        type="text"
        placeholder="بحث عن مستخدم..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.search}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>البريد الإلكتروني</th>
            <th>الصلاحية</th>
            <th>أنشئ في</th>
            <th>إجراء</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>
                {user.id === currentUserId ? (
                  <input
                    value={editingUsername}
                    onChange={(e) => setEditingUsername(e.target.value)}
                    className={styles.usernameInput}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{user.created_at}</td>
              <td>
                {user.id === currentUserId && (
                  <button onClick={handleUsernameUpdate}>تعديل الاسم</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
