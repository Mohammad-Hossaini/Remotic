import { HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";
import styled from "styled-components";

const SectionCTA = styled.div`
    margin: 9.6rem 0 1.4rem 0;
`;

const CTAContainer = styled.div`
    max-width: 110rem;
    border: 1px solid #999;
    border-radius: 2.5rem;
    height: 20rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 40rem;
    padding: 1.7rem 3.4rem;
    justify-content: center;
    align-items: center;
    background-image: url("/cta-image(3).png");
    background-repeat: no-repeat;
    background-color: #154c1e;

    @media (max-width: 75em) {
        grid-template-columns: 1fr 30rem;
    }

    @media (max-width: 59em) {
        grid-template-columns: 1fr;
        height: auto;
        padding: 2rem;
        row-gap: 2rem;
    }
`;

const CTALeft = styled.div`
    margin-left: 2rem;
    margin-bottom: 5rem;

    .cta-title {
        color: #fff;
        font-size: 3rem;
        margin-bottom: 1rem;

        @media (max-width: 44em) {
            font-size: 2.4rem;
        }
    }

    .cta-desc {
        color: #fff;
        font-size: 1.6rem;
        margin-bottom: 1rem;
        @media (max-width: 44em) {
            font-size: 1.4rem;
        }
    }
`;

const CTARight = styled.div`
    border-radius: 7px;
    display: grid;
    grid-template-columns: 1fr 30%;
    column-gap: 1.2rem;
    padding: 1.2rem;
    background-color: lightgrey;

    @media (max-width: 59em) {
        grid-template-columns: 1fr;
        row-gap: 1rem;
    }
`;

const RightLeft = styled.div`
    border-radius: 7px;
    background-color: #fff;
    padding: 1.2rem 2.8rem;

    .cta-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.2rem;
        font-weight: 500;
        color: #555;
        margin-bottom: 0.5rem;
    }

    .cta-icon {
        font-size: 1.4rem;
        color: #087f5b;
    }

    .cta-input {
        width: 100%;
        padding: 0.8rem 1rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 0.8rem;
        margin-bottom: 1rem;
        outline: none;
        transition: border 0.2s;

        &:focus {
            border-color: #087f5b;
        }
    }
`;

// const RightRight = styled.div`
//     border-radius: 7px;
//     padding: 1.4rem;
//     background-color: #087f5b;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     gap: 0.8rem;
//     cursor: pointer;
//     transition: background-color 0.3s ease, transform 0.2s ease;

//     &:hover {
//         background-color: #066649;
//         transform: translateY(-2px);
//     }

//     .btn-text {
//         color: #fff;
//         font-size: 1.6rem;
//         font-weight: 600;
//         letter-spacing: 0.5px;
//         text-transform: uppercase;

//         @media (max-width: 44em) {
//             font-size: 1.4rem;
//         }
//     }

//     .btn-icon {
//         font-size: 4.8rem;
//         color: #fff;
//         transition: transform 0.2s ease;

//         @media (max-width: 44em) {
//             font-size: 3.6rem;
//         }
//     }

//     &:hover .btn-icon {
//         transform: scale(1.1);
//     }
// `;
const RightRight = styled.div`
    border-radius: 7px;
    padding: 0.6rem 1.2rem; /* decreased padding */
    background-color: #087f5b;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4rem; /* decreased gap */
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #066649;
        transform: translateY(-2px);
    }

    .btn-text {
        color: #fff;
        font-size: 1.6rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;

        @media (max-width: 44em) {
            font-size: 1.4rem;
        }
    }

    .btn-icon {
        font-size: 4.8rem;
        color: #fff;
        transition: transform 0.2s ease;

        @media (max-width: 44em) {
            font-size: 3.6rem;
        }
    }

    &:hover .btn-icon {
        transform: scale(1.1);
    }
`;

export default function CTASection() {
    return (
        <SectionCTA>
            <CTAContainer>
                <CTALeft>
                    <div className="cta-description">
                        <h1 className="cta-title">Hire and Work Remotely</h1>
                        <p className="cta-desc">
                            Discover top talent or your next remote job fast.
                        </p>
                    </div>
                </CTALeft>

                <CTARight>
                    <RightLeft>
                        <label htmlFor="email" className="cta-label">
                            <HiOutlineMail className="cta-icon" /> Your Email
                        </label>
                        <input id="email" type="email" className="cta-input" />

                        <label htmlFor="location" className="cta-label">
                            <HiOutlineLocationMarker className="cta-icon" />{" "}
                            Your Location
                        </label>
                        <input
                            id="location"
                            type="text"
                            className="cta-input"
                        />
                    </RightLeft>

                    <RightRight>
                        <p className="btn-text">Find us</p>
                    </RightRight>
                </CTARight>
            </CTAContainer>
        </SectionCTA>
    );
}
