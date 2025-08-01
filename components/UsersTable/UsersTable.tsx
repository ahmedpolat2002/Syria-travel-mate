"use client";

import { useEffect, useState } from "react";
import styles from "./UsersTable.module.css";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
};

export default function UsersTable() {
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
      <div className={styles.card}>
        <h1 style={{ color: "var(--color-light--2)", textAlign: "center" }}>
          إدارة المستخدمين
        </h1>

        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="...بحث عن مستخدم"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search}
          />
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.first} style={{ borderLeft: "none" }}>
                الاسم
              </th>
              <th>البريد الإلكتروني</th>
              <th>الصلاحية</th>
              <th>أنشئ في</th>
              <th className={styles.last}>إجراء</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td data-label="الاسم" style={{ borderLeft: "none" }}>
                  {user.id === currentUserId ? (
                    <input
                      value={editingUsername}
                      onChange={(e) => setEditingUsername(e.target.value)}
                      className={styles.tableInput}
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td data-label="البريد الإلكتروني" className={styles.email}>
                  {user.email}
                </td>
                <td data-label="الصلاحية">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={styles.tableSelect}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td data-label="أنشئ في">{user.created_at}</td>
                <td data-label="إجراء">
                  {user.id === currentUserId && (
                    <button
                      onClick={handleUsernameUpdate}
                      className={styles.tableButton}
                    >
                      تعديل الاسم
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
