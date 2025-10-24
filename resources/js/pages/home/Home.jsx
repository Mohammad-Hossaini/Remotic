import CTASection from "../CTASection";
import Featured from "../Featured";
import Features from "../Features";
import Footer from "../Footer";
import Header from "../Header";
import HeroSection from "../Hero";
import Pricing from "../Pricing";
import Testimonial from "../Testimonial";
import SectionFac from "./FAC/SectionFac";
import "./Home.css";
function Home() {
    return (
        <>
            <Header />
            <HeroSection />
            <Featured />
            <Features />
            <Testimonial />
            <Pricing />
            <SectionFac />
            <CTASection />
            <Footer />
        </>
    );
}

export default Home;
