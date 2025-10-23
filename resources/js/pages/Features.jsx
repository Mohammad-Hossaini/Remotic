import { BsChatDotsFill } from "react-icons/bs";
import { FaGlobe, FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";

/* ==============================
   STYLED COMPONENTS
============================== */

const FeaturesSection = styled.section`
    max-width: 120rem;
    margin: 0 auto;
    padding: 6rem 2rem 4rem 2rem;
    font-family: "Rubik", sans-serif;

    @media (max-width: 75em) {
        padding: 5rem 3rem 3rem 3rem;
    }

    @media (max-width: 59em) {
        padding: 4rem 2rem 2rem 2rem;
    }
`;

const FeaturePrimary = styled.h3`
    font-size: var(--font-xl);
    font-weight: 900;
    text-align: center;
    color: #1f2937;
    margin-bottom: 6rem;
    letter-spacing: 0.5px;

    @media (max-width: 59em) {
        font-size: 2.4rem;
        margin-bottom: 4rem;
    }
`;

const FeatureBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 6rem;
    padding: 6rem 0;
    position: relative;

    &:nth-child(even) {
        direction: rtl;
        > * {
            direction: ltr;
        }
    }

    @media (max-width: 75em) {
        gap: 4rem;
        padding: 5rem 0;
    }

    /* Below 944px (59em) */
    @media (max-width: 59em) {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 6rem;
        padding: 6rem 0;
        direction: ltr;
        > * {
            direction: ltr;
        }
    }

    @media (max-width: 34em) {
        gap: 5rem;
        padding: 7rem 0;
    }
`;

const FeatureImage = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;

    /* Decorative rings */
    &::before,
    &::after {
        content: "";
        position: absolute;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    &::before {
        width: 300px;
        height: 300px;
        background: radial-gradient(
            circle at center,
            #b2f2bb33,
            transparent 70%
        );
        box-shadow: 0 0 40px rgba(8, 127, 91, 0.2);
        z-index: -2;
    }

    &::after {
        width: 340px;
        height: 340px;
        border: 2px dashed rgba(8, 127, 91, 0.2);
        z-index: -1;
    }

    /* Image styling */
    img {
        width: 100%;
        max-width: clamp(220px, 35vw, 420px);
        border-radius: 1rem;
        object-fit: cover;
        z-index: 10;
        filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1));
        transition: all 0.3s ease;
    }

    /* Below 944px */
    @media (max-width: 59em) {
        &::before {
            width: 240px;
            height: 240px;
        }
        &::after {
            width: 270px;
            height: 270px;
        }
        img {
            max-width: 300px;
            margin-top: 0.5rem;
        }
    }

    /* Below 544px */
    @media (max-width: 34em) {
        &::before {
            width: 200px;
            height: 200px;
        }
        &::after {
            width: 230px;
            height: 230px;
        }
        img {
            max-width: 250px;
            margin-top: 1rem;
        }
    }
`;

const FeatureContent = styled.div`
    font-size: var(--font-base);
    font-weight: 500;
    line-height: 1.6;
    z-index: 2;

    p {
        margin-top: 1rem;
    }

    @media (max-width: 59em) {
        padding: 0 1rem;
    }
`;

const FeatureTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    span {
        color: #087f5b;
        display: flex;
        align-items: center;
        font-size: 2.8rem;
    }

    h3 {
        margin: 0;
        font-size: var(--font-lg);
        font-weight: 700;
        color: #1f2937;
    }

    @media (max-width: 59em) {
        justify-content: center;
        font-size: 2rem;
        padding-top: 3rem;
    }
`;

const StyledH3 = styled.p`
    color: var(--color-grey-700);
    font-size: 1.8rem;
    font-weight: 700;
`;

const StyledDescription = styled.p`
    font-size: 1.2rem;
    font-weight: 400;
    line-height: 1.8;
    color: var(--color-grey-600);
`;
const BtnLearnMore = styled.button`
    display: inline-block;
    background-color: #114a38;
    color: #fff;
    border: none;
    padding: 1.2rem 4.5rem;
    font-size: var(--font-sm);
    border-radius: 10rem;
    cursor: pointer;
    font-weight: 600;
    margin-top: 2rem;
    transition: all 0.3s ease;

    &:hover {
        background-color: #087f5b;
        transform: translateY(-2px);
    }

    @media (max-width: 59em) {
        padding: 1rem 3rem;
        font-size: 1.3rem;
    }

    @media (max-width: 34em) {
        padding: 0.8rem 2.5rem;
        font-size: 1.2rem;
    }
`;

/* ==============================
   COMPONENT
============================== */

export default function Features() {
    return (
        <FeaturesSection>
            <FeaturePrimary>
                Your path to remote success in 3 simple steps
            </FeaturePrimary>

            <FeatureBox>
                <FeatureContent>
                    <FeatureTitle>
                        <span>
                            <FaGlobe />
                        </span>
                        <StyledH3>Global Job Access</StyledH3>
                    </FeatureTitle>
                    <StyledDescription>
                        Explore remote job opportunities from companies all
                        around the world. Access listings in multiple industries
                        and time zones, filter by your skills and preferences,
                        and apply directly to positions that match your career
                        goals.
                    </StyledDescription>
                    <Link to="/sign-up">
                        <BtnLearnMore>Get Started</BtnLearnMore>
                    </Link>
                </FeatureContent>
                <FeatureImage>
                    <img
                        src="/features/featureImage2.avif"
                        alt="Collaboration illustration"
                    />
                </FeatureImage>
            </FeatureBox>
            <FeatureBox>
                <FeatureContent>
                    <FeatureTitle>
                        <span>
                            <BsChatDotsFill />
                        </span>
                        <StyledH3>Seamless Communication</StyledH3>
                    </FeatureTitle>
                    <StyledDescription>
                        Connect with your team instantly using built-in chat and
                        messaging tools. Keep every conversation organized in
                        one central hub and avoid the chaos of scattered emails
                        or endless meetings. Share ideas, provide feedback, and
                        stay aligned with your team — whether you’re across the
                        office or across the world.
                    </StyledDescription>
                    <Link to="/sign-up">
                        <BtnLearnMore>Get Started</BtnLearnMore>
                    </Link>
                </FeatureContent>
                <FeatureImage>
                    <img
                        src="/features/featureImage2.avif"
                        alt="Collaboration illustration"
                    />
                </FeatureImage>
            </FeatureBox>

            <FeatureBox>
                <FeatureContent>
                    <FeatureTitle>
                        <span>
                            <FaGraduationCap />
                        </span>
                        <StyledH3>Career Growth & Learning</StyledH3>
                    </FeatureTitle>
                    <StyledDescription>
                        Continuously improve your skills and advance your career
                        with curated resources, webinars, and professional
                        development opportunities. Connect with mentors, join
                        workshops, and receive guidance that helps you excel in
                        the remote work environment.
                    </StyledDescription>
                    <Link to="/sign-up">
                        <BtnLearnMore>Get Started</BtnLearnMore>
                    </Link>
                </FeatureContent>
                <FeatureImage>
                    <img
                        src="/features/featureImage6.avif"
                        alt="Career growth and learning illustration"
                    />
                </FeatureImage>
            </FeatureBox>
        </FeaturesSection>
    );
}
