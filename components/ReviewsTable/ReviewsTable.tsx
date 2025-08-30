import styles from "./ReviewsTable.module.css";

interface Review {
  id: string;
  username: string;
  placeName: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export default function ReviewsTable({ reviews }: { reviews: Review[] }) {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.card}>
        <h1 style={{ color: "var(--color-light--2)", marginBottom: "20px", marginLeft: "20px" }}>المراجعات</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.first} style={{ borderLeft: "none" }}>المستخدم</th>
              <th>المكان</th>
              <th>التقييم</th>
              <th>التعليق</th>
              <th className={styles.last}>تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id} className={styles.scalable}>
                <td style={{ borderLeft: "none" }}>{r.username}</td>
                <td>{r.placeName}</td>
                <td>{r.rating}</td>
                <td>{r.comment || "لا يوجد"}</td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}