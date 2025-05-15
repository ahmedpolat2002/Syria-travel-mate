import ReviewsTable from "@/components/ReviewsTable/ReviewsTable";

async function fetchReviews() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/reviews/all`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("فشل في تحميل بيانات المراجعات");
  }

  return res.json();
}

export default async function ReviewsTablePage() {
  const reviews = await fetchReviews();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">جدول جميع المراجعات</h1>
      <ReviewsTable reviews={reviews} />
    </main>
  );
}
