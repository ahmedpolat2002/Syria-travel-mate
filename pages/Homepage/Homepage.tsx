// import LoginPage from "@/components/LoginForm/LoginPage";
// import SignUpPage from "../../components/SignUpForm/SignUpPage";
import styles from "./Homepage.module.css";
import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Booking from "@/components/Booking/Booking";
import CardsSection from "@/components/card/CardsSection";
import EventSection from "@/components/EventSlider/EventSection";
import Footer from "@/components/Footer/Footer";

function Homepage() {
  return (
    <div>
      <div className={styles.container}>
        <Header />
        <Hero />
        <Booking />
        <CardsSection />
        <EventSection />

        <Footer />
      </div>
    </div>
  );
}

export default Homepage;
