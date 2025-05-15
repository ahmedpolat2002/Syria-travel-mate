import React from "react";
import PlaceDetails from "./PlaceDetails";
import styles from "./PlaceDetailsPage.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const samplePlace = {
  id: "1",
  name: "Al-Azem Palace",
  governorate: "Damascus",
  type: "Historical Site",
  description:
    "Al-Azem Palace is a palace in Damascus, Syria which was originally built in 1750 as a residence for the Ottoman governor of Damascus, As'ad Pasha al-Azem. The palace now houses the Museum of Arts and Popular Traditions. It is an excellent example of Damascene traditional houses.",
  isSafe: true,
  rating: 4.5,
  likes: 128,
  imageUrl: "shiraton.avif",
  comments: [
    {
      id: "1",
      username: "Ahmad",
      text: "Beautiful historical site! The architecture is amazing.",
      date: new Date("2025-04-15T14:30:00"),
    },
    {
      id: "2",
      username: "Sarah",
      text: "I visited last month, and the tour guides were very knowledgeable. Highly recommend!",
      date: new Date("2025-05-02T09:15:00"),
    },
  ],
};

const PlaceDetailsPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <PlaceDetails place={samplePlace} />
      </div>
      <Footer />
    </>
  );
};

export default PlaceDetailsPage;
