import { FaStar } from "react-icons/fa";
import styled from "styled-components";

const StyledAllContainer = styled.div`
    font-family: "Rubik", sans-serif;
    background: var(--color-grey-0);
    color: var(--text-color);
    padding: 6.4rem 0;
    transition: all 0.3s ease;
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
        color: var(--text-color);
        transition: color 0.3s ease;

        @media (max-width: 1344px) {
            font-size: 2.8rem;
        }
        @media (max-width: 1200px) {
            font-size: 2.4rem;
        }
        @media (max-width: 944px) {
            font-size: 2rem;
        }
        @media (max-width: 704px) {
            font-size: 1.8rem;
        }
        @media (max-width: 544px) {
            font-size: 1.6rem;
        }
    }

    p {
        font-size: 1.6rem;
        color: var(--color-grey-500);
        line-height: 1.6;
        max-width: 60rem;
        transition: color 0.3s ease;
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
    background: var(--color-grey-200);
    border-radius: 1.6rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.08);

    &:hover {
        transform: translateY(-0.4rem);
        box-shadow: 0 1.2rem 2.4rem rgba(0, 0, 0, 0.12);
    }

    @media (max-width: 75em) {
        font-size: 1.3rem;
        padding: 2.2rem;
    }

    /* Dark theme overrides */
    [data-theme="dark"] & {
        background: var(--color-grey-30);
        box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.4);
        &:hover {
            box-shadow: 0 1.2rem 2.4rem rgba(0, 0, 0, 0.6);
        }
    }
`;

const CustomerProfile = styled.img`
    width: 6.4rem;
    height: 6.4rem;
    border-radius: 50%;
    margin-bottom: 1.6rem;
    object-fit: cover;
    border: 2px solid var(--color-primary);

    @media (max-width: 59em) {
        width: 5.6rem;
        height: 5.6rem;
    }

    [data-theme="dark"] & {
        border-color: var(--color-primary-light);
    }
`;

const TestimonialIcon = styled.div`
    display: flex;
    gap: 0.4rem;
    justify-content: center;
    margin-bottom: 1.2rem;
    color: var(--color-primary);
    font-size: 1.8rem;
`;

const CustomerMessage = styled.p`
    font-size: 1.4rem;
    color: var(--text-color);
    line-height: 1.6;
    margin-bottom: 1.6rem;
    transition: color 0.3s ease;
    [data-theme="dark"] & {
        color: var(--color-grey-400);
    }

    @media (max-width: 59em) {
        font-size: 1.3rem;
    }
`;
const FeaturePrimary = styled.h3`
    font-size: var(--font-xl);
    font-weight: 900;
    text-align: center;
    color: #1f2937;
    margin-bottom: 6rem;
    letter-spacing: 0.5px;

    /* 🌙 Dark mode title color */
    [data-theme="dark"] & {
        color: var(--color-grey-400);
    }

    @media (max-width: 59em) {
        font-size: 2.4rem;
        margin-bottom: 4rem;
    }
`;
const CustomerName = styled.p`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-primary);

    @media (max-width: 59em) {
        font-size: 1.4rem;
    }
`;

export default function Testimonial({ id }) {
    return (
        <StyledAllContainer id={id}>
            <TestimonialSection>
                <TestimonialTitle>
                    <FeaturePrimary>
                        Hear What Our Users Are Saying
                    </FeaturePrimary>
                    <p>
                        Real feedback from remote professionals who have
                        achieved global success through our platform.
                    </p>
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
