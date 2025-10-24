import { FaStar } from "react-icons/fa";
import styled from "styled-components";

const StyledAllContainer = styled.div`
    background: linear-gradient(to bottom, #e6f2ef 0%, #f9f9f9 100%);
    padding: 6.4rem 0;
`;

const TestimonialSection = styled.div`
    margin: 0 auto;
    max-width: 120rem;
`;

const TestimonialTitle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    align-items: center;
    margin-bottom: 6.4rem;
    text-align: center;

    h3 {
        font-size: 3rem; 
        font-weight: 900;
        line-height: 1.2;
        text-align: center;
        color: #1f2937;
        position: relative;
        z-index: 1;
        background-color: transparent;
        padding: 0 1rem;

        /**************************/
        /* BELOW 1344px (Smaller desktops) */
        /**************************/
        @media (max-width: 1344px) {
            font-size: 2.8rem;
        }

        /**************************/
        /* BELOW 1200px (Landscape Tablets) */
        /**************************/
        @media (max-width: 1200px) {
            font-size: 2.4rem;
        }

        /**************************/
        /* BELOW 944px (Tablets) */
        /**************************/
        @media (max-width: 944px) {
            font-size: 2rem;
        }

        /**************************/
        /* BELOW 704px (Smaller tablets) */
        /**************************/
        @media (max-width: 704px) {
            font-size: 1.8rem;
        }

        /**************************/
        /* BELOW 544px (Phones) */
        /**************************/
        @media (max-width: 544px) {
            font-size: 1.6rem;
        }
    }

    p {
        font-size: 1.6rem;
        color: #555;
        line-height: 1.6;
        max-width: 60rem;
    }
`;

const TestimonialContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 4.8rem;
    row-gap: 4.8rem;
    padding: 0 6rem;

    @media (max-width: 1344px) {
        padding: 0 5rem;
    }

    @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
        padding: 0 4rem;
    }

    @media (max-width: 944px) {
        grid-template-columns: 1fr;
        padding: 0 3rem;
    }

    @media (max-width: 544px) {
        padding: 0 2rem;
    }
`;

const TestimonialBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.4rem;
    background: #fff;
    border-radius: 1.6rem;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.08);

    &:hover {
        transform: translateY(-0.4rem);
        box-shadow: 0 1.2rem 2.4rem rgba(0, 0, 0, 0.12);
    }

    @media (max-width: 75em) {
        font-size: 1.3rem;
        padding: 2.2rem;
    }
`;

const CustomerProfile = styled.img`
    width: 6.4rem;
    height: 6.4rem;
    border-radius: 50%;
    margin-bottom: 1.6rem;
    object-fit: cover;

    @media (max-width: 59em) {
        width: 5.6rem;
        height: 5.6rem;
    }
`;

const TestimonialIcon = styled.div`
    display: flex;
    gap: 0.4rem;
    justify-content: center;
    margin-bottom: 1.2rem;
    color: #087f5b;
    font-size: 1.8rem;
`;

const CustomerMessage = styled.p`
    font-size: 1.4rem;
    color: #333;
    line-height: 1.6;
    margin-bottom: 1.6rem;

    @media (max-width: 59em) {
        font-size: 1.3rem;
    }
`;

const CustomerName = styled.p`
    font-size: 1.6rem;
    font-weight: 600;
    color: #087f5b;

    @media (max-width: 59em) {
        font-size: 1.4rem;
    }
`;

export default function Testimonial() {
    return (
        <StyledAllContainer>
            <TestimonialSection>
                <TestimonialTitle>
                    <h3>Hear What Our Users Are Saying</h3>
                </TestimonialTitle>

                <TestimonialContainer>
                    <TestimonialBox>
                        <CustomerProfile
                            src="/profile/profile-10.jpg"
                            alt="Sofia Johnson"
                        />
                        <TestimonialIcon>
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </TestimonialIcon>
                        <CustomerMessage>
                            "Remote Work Hub has transformed the way I connect
                            with global companies. Projects match my skills and
                            collaboration is seamless."
                        </CustomerMessage>
                        <CustomerName>
                            Mohammad Rahimi : Data Scientist
                        </CustomerName>
                    </TestimonialBox>

                    <TestimonialBox>
                        <CustomerProfile
                            src="/profile/profile-8.jpg"
                            alt="Mohammad Rahimi"
                        />
                        <TestimonialIcon>
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </TestimonialIcon>
                        <CustomerMessage>
                            "Thanks to Remote Work Hub, I landed my first
                            international data science project within weeks."
                        </CustomerMessage>
                        <CustomerName>
                            Sofia Johnson : Project Manager
                        </CustomerName>
                    </TestimonialBox>

                    <TestimonialBox>
                        <CustomerProfile
                            src="/profile/profile-12.jpg"
                            alt="John Smith"
                        />
                        <TestimonialIcon>
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </TestimonialIcon>
                        <CustomerMessage>
                            "Remote Work Hub transformed how I find online
                            teaching opportunities worldwide."
                        </CustomerMessage>
                        <CustomerName>John Smith : Online Teacher</CustomerName>
                    </TestimonialBox>
                </TestimonialContainer>
            </TestimonialSection>
        </StyledAllContainer>
    );
}
