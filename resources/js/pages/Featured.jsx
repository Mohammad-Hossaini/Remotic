// Featured.jsx
import styled, { keyframes } from "styled-components";

// Animation for smooth scrolling logos
const scroll = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

// Section container
const FeaturedSection = styled.section`
    background-color: #ffffff;
    padding: 2.8rem 0 1.8rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
`;

// Inner container for centering content
const FeaturedContainer = styled.div`
    max-width: 120rem;
    width: 90%;
    margin: 0 auto;
    text-align: center;
`;

// Section title
const FeaturedTitle = styled.p`
    font-size: var(--font-base);
    font-weight: 900;
    color: #1f2937;
    margin-bottom: 1.4rem;
`;

// Scrolling logo box
const FeaturedBox = styled.div`
    overflow: hidden;
    width: 100%;
    display: flex;
    justify-content: center;
`;

// Logos row with animation
const Logos = styled.div`
    display: flex;
    gap: 6rem;
    align-items: center;
    animation: ${scroll} 20s linear infinite;

    img {
        height: 3.6rem;
        object-fit: contain;
        transition: all 0.3s ease;
    }

    /* Responsiveness for logo sizes */
    @media (max-width: 84em) {
        gap: 5rem;
        img {
            height: 3.2rem;
        }
    }
    @media (max-width: 75em) {
        gap: 4rem;
        img {
            height: 2.8rem;
        }
    }
    @media (max-width: 59em) {
        gap: 3rem;
        img {
            height: 2.4rem;
        }
    }
    @media (max-width: 44em) {
        gap: 2.4rem;
        img {
            height: 2rem;
        }
    }
    @media (max-width: 34em) {
        gap: 2rem;
        img {
            height: 1.8rem;
        }
    }
`;

export default function Featured({ id }) {
    return (
        <FeaturedSection>
            <FeaturedContainer>
                <FeaturedTitle id={id}>
                    In the spotlight of global brands
                </FeaturedTitle>
                <FeaturedBox>
                    <Logos>
                        <img
                            src="/logos/techcrunch.png"
                            alt="Techcrunch logo"
                        />
                        <img
                            src="/logos/business-insider.png"
                            alt="Business Insider logo"
                        />
                        <img
                            src="/logos/the-new-york-times.png"
                            alt="The New York Times logo"
                        />
                        <img src="/logos/forbes.png" alt="Forbes logo" />
                        <img src="/logos/usa-today.png" alt="USA Today logo" />
                        {/* Repeat for smooth animation */}
                        <img
                            src="/logos/techcrunch.png"
                            alt="Techcrunch logo"
                        />
                        <img
                            src="/logos/business-insider.png"
                            alt="Business Insider logo"
                        />
                        <img
                            src="/logos/the-new-york-times.png"
                            alt="The New York Times logo"
                        />
                        <img src="/logos/forbes.png" alt="Forbes logo" />
                        <img src="/logos/usa-today.png" alt="USA Today logo" />
                    </Logos>
                </FeaturedBox>
            </FeaturedContainer>
        </FeaturedSection>
    );
}
