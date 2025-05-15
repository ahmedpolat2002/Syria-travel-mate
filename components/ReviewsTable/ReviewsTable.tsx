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
      <table className={styles.table}>
        <thead>
          <tr>
            <th>المستخدم</th>
            <th>المكان</th>
            <th>التقييم</th>
            <th>التعليق</th>
            <th>تاريخ الإنشاء</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id}>
              <td>{r.username}</td>
              <td>{r.placeName}</td>
              <td>{r.rating}</td>
              <td>{r.comment || "لا يوجد"}</td>
              <td>{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
