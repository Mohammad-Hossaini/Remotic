import { useRef } from "react";
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
    const heroRef = useRef(null);
    return (
        <>
            <Header heroRef={heroRef} />
            <HeroSection id="home" ref={heroRef} />
            {/* <Featured id="featured" /> */}
            <Features id="sit-features" />
            <Testimonial id="testimonial" />
            <Pricing id="pricing" />
            <SectionFac id="fac" />
            <CTASection id="cta" />
            <Footer />
        </>
    );
}

export default Home;
