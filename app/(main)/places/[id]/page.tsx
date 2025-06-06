import React from "react";
import PlaceDetails from "@/components/PlaceDetails/PlaceDetails";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { getPlaceDetailsById, getReviewsByPlaceId } from "@/lib/data/places";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<{ title: string; description: string }> {
  const { id } = await params;
  const place = await getPlaceDetailsById(id);

  if (!place) {
    notFound();
  }

  return {
    title: `${place.name} في ${place.provinceName}`,
    description: `${place.name} يقع في محافظة ${place.provinceName}، ${place.description}.`,
  };
}

const PlaceDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const [place, reviews] = await Promise.all([
    getPlaceDetailsById(id),
    getReviewsByPlaceId(id),
  ]);

  if (!place) {
    return (
      <>
        <Header />
        <div className="pageContainer">
          <p>المكان غير موجود</p>
        </div>
        <Footer />
      </>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const placeData = {
    id: place.id.toString(),
    name: place.name,
    governorate: place.provinceName,
    type: place.typeName,
    description: place.description,
    safetyStatus: place.safetyStatus, // 'safe' | 'warning' | 'danger'
    rating: averageRating,
    likes: 0, // أضف لاحقًا دالة getLikesCount(placeId)
    imageUrl: `${place.image}`,
    comments: reviews.map((r) => ({
      id: r.id,
      username: r.username,
      text: r.comment,
      rating: r.rating,
      date: new Date(r.created_at),
    })),
  };

  return (
    <>
      <Header />
      <div className="pageContainer">
        <PlaceDetails place={placeData} />
      </div>
      <Footer />
    </>
  );
};

export default PlaceDetailsPage;
