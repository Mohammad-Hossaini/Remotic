import { Link } from "react-router-dom";
import styled from "styled-components";

/* ==============================
   STYLED COMPONENTS
============================== */

const SectionHero = styled.section`
    padding: 7.2rem 2.4rem 4.4rem 2.4rem;
    background-color: #e6f2ef;
    font-family: "Rubik", sans-serif;
    height: 100vh;
    @media (max-width: 84em) {
        min-height: 55rem;
        padding: 6rem 4rem;
    }

    @media (max-width: 75em) {
        min-height: 53rem;
        padding: 5rem 3rem;
    }

    @media (max-width: 59em) {
        min-height: 93rem;
        padding: 4rem 2rem;
    }
`;

const Hero = styled.div`
    max-width: 120rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 45% 1fr;
    gap: 8rem;
    align-items: center;

    /**************************/
    /* BELOW 1344px (Smaller desktops) */
    /**************************/
    @media (max-width: 84em) {
        gap: 6rem;
    }

    /**************************/
    /* BELOW 1200px (Landscape Tablets) */
    /**************************/
    @media (max-width: 75em) {
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
    }

    /**************************/
    /* BELOW 944px (Tablets) */
    /**************************/
    @media (max-width: 59em) {
        grid-template-columns: 1fr;
        gap: 3rem;
        text-align: center;
    }

    /**************************/
    /* BELOW 704px (Smaller tablets) */
    /**************************/
    @media (max-width: 44em) {
        gap: 2.5rem;
    }

    /**************************/
    /* BELOW 544px (Phones) */
    /**************************/
    @media (max-width: 34em) {
        gap: 2rem;
    }
`;

const HeroTextBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    /* Add some left padding for mid-sized screens */
    @media (max-width: 75em) and (min-width: 59em) {
        padding-left: 5rem; // adjust as needed
    }

    @media (max-width: 59em) {
        align-items: center;
        padding-left: 0;
        padding-right: 0;
    }
`;

const HeadingPrimary = styled.h1`
    font-size: var(--font-2xl);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: 1px;
    color: var(--color-grey-800);

    @media (max-width: 84em) {
        font-size: 3.5rem;
    }
    @media (max-width: 59em) {
        font-size: 3rem;
        padding: 1.2rem 1.2rem;
    }
    @media (max-width: 44em) {
        font-size: 2.6rem;
    }
    @media (max-width: 34em) {
        font-size: 2.2rem;
    }
`;

const HeroDescription = styled.p`
    margin-top: 8px;
    font-size: var(--font-base);
    color: var(--color-grey-700);
    line-height: 1.4;
    font-weight: 500;

    @media (max-width: 59em) {
        font-size: 1.4rem;
        padding: 1.2rem 1.8rem;
    }
    @media (max-width: 34em) {
        font-size: 1.3rem;
    }
`;

const CTAButton = styled(Link)`
    display: inline-block;
    font-size: var(--font-sm);
    background-color: #114a38;
    color: #fff;
    border-radius: var(--radius-xxl);
    padding: 1.2rem 5.6rem;
    margin-top: 2rem;
    transition: all 0.5s;
    font-weight: 600;
    text-decoration: none;

    &:hover,
    &:active {
        background-color: #087f5b;
    }

    @media (max-width: 59em) {
        padding: 1rem 4rem;
        font-size: 1.3rem;
    }
    @media (max-width: 34em) {
        padding: 1rem 3rem;
        font-size: 1.2rem;
    }
`;

const Profiles = styled.div`
    margin-top: 15%;

    img {
        width: 5.6rem;
        height: 5.6rem;
        border-radius: 50%;
        border: 3px solid #e6f2ef;
    }

    img + img {
        margin-left: -1.6rem;
    }

    @media (max-width: 59em) {
        margin-top: 10%;
    }
`;

const Statistic = styled.p`
    margin-top: var(--space-8);
    font-size: var(--font-sm);
    font-weight: 700;
    line-height: 1.4;
    color: var(--color-grey-700);

    strong {
        color: #087f5b;
        font-size: var(--font-base);
    }

    @media (max-width: 59em) {
        font-size: 1.3rem;
        padding: 1.2rem 1.8rem;
    }
`;

const HeroImageBox = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4rem;
    isolation: isolate;

    @media (max-width: 59em) {
        margin-top: 7rem;
        padding: 2rem;
    }

    @media (max-width: 44em) {
        margin-top: 10rem;
    }

    &::before {
        content: "";
        position: absolute;
        width: 320px;
        height: 320px;
        border-radius: 50%;
        background: radial-gradient(
            circle at center,
            #b2f2bb33,
            transparent 70%
        );
        box-shadow: 0 0 60px rgba(8, 127, 91, 0.4);
        z-index: -2;
    }

    &::after {
        content: "";
        position: absolute;
        width: 380px;
        height: 380px;
        border-radius: 50%;
        border: 2px dashed rgba(8, 127, 91, 0.4);
        z-index: -1;
    }
`;

const HeroImage = styled.img`
    width: 100%;
    max-width: 400px;
    border-radius: 50%;
    z-index: 10;
    filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15));
    object-fit: cover;

    @media (max-width: 59em) {
        max-width: 400px;
    }
    @media (max-width: 44em) {
        max-width: 350px;
    }
`;

/* ==============================
   COMPONENT
============================== */

export default function HeroSection() {
    return (
        <main>
            <SectionHero>
                <Hero>
                    <HeroTextBox>
                        <HeadingPrimary>
                            Empowering Your Remote Career Journey
                        </HeadingPrimary>

                        <HeroDescription>
                            Find remote jobs that fit your skills and lifestyle.
                            Connect with global companies, grow your career, and
                            unlock new opportunities from anywhere.
                        </HeroDescription>

                        <CTAButton to="/register-employer">
                            Post a Job – It’s Free
                        </CTAButton>

                        <Profiles>
                            <img src="/profile/profile-1.jpg" alt="profile 1" />
                            <img src="/profile/profile-2.jpg" alt="profile 2" />
                            <img src="/profile/profile-3.jpg" alt="profile 3" />
                            <img src="/profile/profile-4.jpg" alt="profile 4" />
                            <img src="/profile/profile-5.jpg" alt="profile 5" />
                            <img src="/profile/profile-6.jpg" alt="profile 6" />
                        </Profiles>

                        <Statistic>
                            More than <strong>7,500</strong> professionals have
                            joined Remote Work Hub, collaborating, sharing
                            knowledge, and building projects together
                        </Statistic>
                    </HeroTextBox>

                    <HeroImageBox>
                        <HeroImage
                            src="hero-image-removebg-preview.png"
                            alt="Remote work illustration"
                        />
                    </HeroImageBox>
                </Hero>
            </SectionHero>
        </main>
    );
}
