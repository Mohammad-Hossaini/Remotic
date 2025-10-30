import { useState } from "react";
import { FaChevronDown, FaStar } from "react-icons/fa";
import styled from "styled-components";

const SectionFAQWrapper = styled.section`
    font-family: "Rubik", sans-serif;
    max-width: 100rem;
    margin: 9.6rem auto;
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
    padding: 0 2rem;

    .faq-title {
        font-size: 3rem;
        font-weight: 900;
        text-align: center;
        margin-bottom: 3rem;
        color: var(--color-grey-800);

        @media (max-width: 44em) {
            font-size: 2.4rem;
        }

        /* 🌙 Dark mode */
        [data-theme="dark"] & {
            color: var(--color-grey-300);
        }
    }

    .accordion-item {
        background: var(--color-grey-0);
        box-shadow: var(--shadow-md);
        padding: 1.4rem 2rem;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        border-radius: var(--radius-sm);
        position: relative;
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
            transform: translateY(-0.3rem);
            box-shadow: var(--shadow-lg);
        }

        /* 🌙 Dark mode */
        [data-theme="dark"] & {
            background: var(--color-grey-200);
            box-shadow: 0 0 2rem rgba(255, 255, 255, 0.08);
        }

        .number {
            font-weight: 500;
            font-size: 2.4rem;
            color: var(--color-grey-400);

            [data-theme="dark"] & {
                color: var(--color-grey-500);
            }
        }

        .question {
            margin-left: 2.5rem;
            font-weight: 500;
            font-size: 2.4rem;
            color: var(--color-grey-800);

            @media (max-width: 44em) {
                font-size: 2rem;
            }

            [data-theme="dark"] & {
                color: var(--color-grey-400);
            }
        }

        .icon {
            font-size: 2rem;
            color: var(--color-primary);
            transition: transform 0.3s ease;
        }

        &.open .icon {
            transform: rotate(180deg);
        }

        .answer-box {
            grid-column: 2 / 3;
            overflow: hidden;
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
            transition: max-height 0.5s ease, padding 0.5s ease;

            &.open {
                max-height: 50rem;
                padding-top: 1.6rem;
                padding-bottom: 1.6rem;
            }

            p {
                font-size: 1.6rem;
                line-height: 1.6;
                margin-bottom: 1.6rem;
                color: var(--color-grey-700);

                [data-theme="dark"] & {
                    color: var(--color-grey-500);
                }
            }

            ul {
                color: var(--color-grey-500);
                margin-left: 2rem;
                display: flex;
                flex-direction: column;
                gap: 1.2rem;
                font-size: 1.6rem;

                [data-theme="dark"] & {
                    color: var(--color-grey-500);
                }

                li {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;

                    .star-icon {
                        color: #ffd43b;
                        font-size: 1.2rem;
                    }
                }
            }
        }
    }
`;

export default function SectionFAQ({ id }) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            number: "01",
            question: "How do I post a new job listing?",
            answer: `Posting a job is simple! Navigate to the dashboard, click "Post Job", and fill in the required details about your position and requirements.`,
            list: [
                "Click 'Post Job' on your dashboard.",
                "Add job title, description, and requirements.",
                "Set application deadlines.",
                "Publish the listing for candidates to see.",
            ],
        },
        {
            number: "02",
            question: "What is the pricing for job postings?",
            answer: `We offer flexible plans to match your hiring needs. You can choose a Starter plan for small teams or Pro Business for unlimited postings.`,
            list: [
                "Starter plan: limited job postings for small teams.",
                "Pro Business: unlimited postings and premium support.",
                "Payments are secure via our platform.",
                "Upgrade anytime based on your needs.",
            ],
        },
        {
            number: "03",
            question: "How can I manage applications?",
            answer: `All received applications are stored in your dashboard. You can review, shortlist, or message candidates directly from the platform.`,
            list: [
                "View all applications in the dashboard.",
                "Filter candidates by skills or experience.",
                "Shortlist top candidates.",
                "Communicate via in-platform messaging.",
            ],
        },
        {
            number: "04",
            question: "Can I hire international candidates?",
            answer: `Yes! Our platform supports hiring globally, including managing time zones, remote collaboration, and contracts.`,
            list: [
                "Post jobs visible worldwide.",
                "Interview candidates across time zones.",
                "Set up contracts and payments securely.",
                "Collaborate remotely using integrated tools.",
            ],
        },
    ];

    return (
        <SectionFAQWrapper id={id}>
            <p className="faq-title">Frequently Asked Questions</p>
            {faqs.map((item, index) => (
                <div
                    key={index}
                    className={`accordion-item ${
                        openIndex === index ? "open" : ""
                    }`}
                    onClick={() => toggleAccordion(index)}
                >
                    <p className="number">{item.number}</p>
                    <p className="question">{item.question}</p>
                    <span className="icon">
                        <FaChevronDown />
                    </span>

                    <div
                        className={`answer-box ${
                            openIndex === index ? "open" : ""
                        }`}
                    >
                        <p>{item.answer}</p>
                        <ul>
                            {item.list.map((li, i) => (
                                <li key={i}>
                                    <FaStar className="star-icon" />
                                    {li}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </SectionFAQWrapper>
    );
}
