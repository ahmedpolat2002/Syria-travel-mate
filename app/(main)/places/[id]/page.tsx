import React from "react";
import PlaceDetails from "@/components/PlaceDetails/PlaceDetails";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

async function getPlaceData(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/places/${id}`,
    {
      next: { revalidate: 10 }, // ISR
    }
  );
  if (!res.ok) throw new Error("Failed to fetch place");

  const place = await res.json();

  const reviewsRes = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/reviews/${id}`
  );
  const reviews = await reviewsRes.json();

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum: number, r: { rating: number }) => sum + r.rating,
          0
        ) / reviews.length
      : 0;

  return {
    id: place.id,
    name: place.name,
    governorate: place.provinceName,
    type: place.typeName,
    description: place.description,
    isSafe: place.safetyStatus === "safe",
    rating: averageRating,
    likes: 0, // ستحتاج API لحساب الإعجابات
    imageUrl: `${place.image}`,
    comments: reviews.map(
      (r: {
        id: string;
        username: string;
        comment: string;
        rating: number;
        created_at: string;
      }) => ({
        id: r.id,
        username: r.username,
        text: r.comment,
        rating: r.rating,
        date: new Date(r.created_at),
      })
    ),
  };
}

const PlaceDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const place = await getPlaceData(id);

  return (
    <>
      <Header />
      <div className="pageContainer">
        <PlaceDetails place={place} />
      </div>
      <Footer />
    </>
  );
};

export default PlaceDetailsPage;
