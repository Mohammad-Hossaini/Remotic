import { FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SectionPricing = styled.section`
    font-family: "Rubik", sans-serif;
    padding: 9.6rem 0;
    background-color: var(--color-grey-0);
    transition: all 0.3s ease;
`;

const PricingTitle = styled.div`
    text-align: center;
    margin-bottom: 6.4rem;

    .subheading {
        color: var(--color-primary);
        font-weight: 500;
        font-size: 1.8rem;
    }

    .heading-secondary {
        margin-top: 1.4rem;
        font-size: 4rem;
        font-weight: 700;
        color: var(--text-color);
    }
`;

const PricingContainer = styled.div`
    max-width: 120rem;
    padding: 0 3.2rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6.4rem;
    justify-items: center;
    align-items: start;

    @media (max-width: 59em) {
    }

    @media (max-width: 44em) {
        grid-template-columns: 1fr;
        row-gap: 6.4rem;
    }
`;

const PricingPlan = styled.div`
    border-radius: 11px;
    width: 80%;
    padding: ${(props) => (props.variant === "starter" ? "4.6rem" : "4.8rem")};
    background-color: ${(props) =>
        props.variant === "complete" ? "var(--color-grey-50)" : "transparent"};
    border: ${(props) =>
        props.variant === "starter"
            ? "2px solid var(--color-grey-50)"
            : "none"};
    justify-self: center;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-0.8rem);
        box-shadow: 0 1.2rem 3.2rem rgba(0, 0, 0, 0.08);
    }

    &::after {
        content: ${(props) =>
            props.variant === "complete" ? '"Best value"' : ""};
        position: absolute;
        top: 6%;
        right: -18%;
        text-transform: uppercase;
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--text-color);
        background-color: #ffd43b;
        padding: 0.8rem 8rem;
        transform: rotate(45deg);
    }

    @media (max-width: 75em) {
        width: 100%;
        &::after {
            right: -12%;
        }
    }

    @media (max-width: 59em) {
        width: 90%;
        &::after {
            right: -25%;
        }
    }

    @media (max-width: 54.06em) and (min-width: 44em) {
        width: 88%;
        &::after {
            display: none;
        }
    }

    @media (max-width: 44em) {
        width: 80%;
        &::after {
            right: -17%;
        }
    }

    /* Dark Mode */
    [data-theme="dark"] & {
        background-color: ${(props) =>
            props.variant === "complete"
                ? "var(--color-grey-100)"
                : "var(--color-grey-100)"};
        border-color: ${(props) =>
            props.variant === "starter" ? "var(--color-grey-100)" : "none"};
        color: var(--text-color);

        &::after {
            color: var(--color-grey-900);
            background-color: #fbbf24;
        }

        &:hover {
            box-shadow: 0 1.2rem 3.2rem rgba(0, 0, 0, 0.6);
        }
    }
    [data-theme="dark"] & {
        color: var(--color-grey-500);
    }
`;

const PlanHeader = styled.header`
    text-align: center;
    margin-bottom: 4.8rem;
`;

const PlanName = styled.p`
    color: var(--color-primary);
    font-weight: 600;
    font-size: 2rem;
    text-transform: uppercase;
    letter-spacing: 0.75px;
    margin-bottom: 1.8rem;
`;

const PlanPrice = styled.p`
    font-size: 6rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 1.6rem;

    span {
        font-size: 2.4rem;
        font-weight: 500;
        margin-right: 0.8rem;
    }
`;

const PlanText = styled.p`
    font-size: 1.6rem;
    color: var(--color-grey-500);
`;

const List = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
`;

const ListItem = styled.li`
    font-size: 1.8rem;
    display: flex;
    align-items: center;
    gap: 1.6rem;
    line-height: 1.4;

    .list-icon {
        width: 2.4rem;
        height: 2.4rem;
        color: var(--color-primary);
    }
`;

const PlanSignUp = styled.div`
    text-align: center;
    margin-top: 3.4rem;

    .pricing-btn {
        display: inline-block;
        padding: 1.4rem 2.8rem;
        font-weight: 500;
        font-size: 1.6rem;
        color: #fff;
        border-radius: 5px;
        background-color: var(--color-primary-dark);
        text-decoration: none;
        transition: all 0.3s ease;

        &:hover {
            background-color: var(--color-primary);
        }
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

export default function Pricing({ id }) {
    return (
        <SectionPricing id={id}>
            <PricingTitle>
                <span className="subheading">Pricing</span>
                <FeaturePrimary className="heading-secondary">
                    Choose the perfect plan for your hiring needs
                </FeaturePrimary>
            </PricingTitle>

            <PricingContainer>
                {/* Starter Plan */}
                <PricingPlan variant="starter">
                    <PlanHeader>
                        <PlanName>Starter</PlanName>
                        <PlanPrice>
                            <span>$</span>49
                        </PlanPrice>
                        <PlanText>
                            Ideal for startups hiring their first freelancers.
                        </PlanText>
                    </PlanHeader>

                    <List>
                        <ListItem>
                            <FaCheck className="list-icon" />
                            <span>Post up to 3 job listings</span>
                        </ListItem>
                        <ListItem>
                            <FaCheck className="list-icon" />
                            <span>Basic candidate matching</span>
                        </ListItem>
                        <ListItem>
                            <FaCheck className="list-icon" />
                            <span>Email support</span>
                        </ListItem>
                    </List>

                    <PlanSignUp>
                        <Link to="/sign-up" className="pricing-btn">
                            Get Started
                        </Link>
                    </PlanSignUp>
                </PricingPlan>

                {/* Complete Plan */}
                <PricingPlan variant="complete">
                    <PlanHeader>
                        <PlanName>Pro Business</PlanName>
                        <PlanPrice>
                            <span>$</span>99
                        </PlanPrice>
                        <PlanText>
                            Perfect for growing companies hiring remotely at
                            scale.
                        </PlanText>
                    </PlanHeader>

                    <List>
                        <ListItem>
                            <FaCheck className="list-icon" />
                            <span>Unlimited job postings</span>
                        </ListItem>
                        <ListItem>
                            <FaCheck className="list-icon" />
                            <span>Smart talent recommendations</span>
                        </ListItem>
                        <ListItem>
                            <FaCheck className="list-icon" />
                            <span>Priority job placement</span>
                        </ListItem>
                    </List>

                    <PlanSignUp>
                        <Link to="/sign-up" className="pricing-btn">
                            Upgrade Now
                        </Link>
                    </PlanSignUp>
                </PricingPlan>
            </PricingContainer>
        </SectionPricing>
    );
}
