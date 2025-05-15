import Header from "@/components/Header/Header";
import Home from "@/components/Home/Home";
import Destinations from "@/components/Destinations/Destinations";
import Events from "@/components/Events/Events";
import About from "@/components/About/About";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";

function Homepage() {
  return (
    <>
      <Header />
      <main>
        <Home />
        <Destinations />
        <Events />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default Homepage;
