import { BsTwitterX } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io";
import { Link } from "react-router-dom";
import styled from "styled-components";

const FooterContainer = styled.footer`
    padding: 6rem 1.6rem;
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
`;

const FooterGrid = styled.div`
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
    gap: 4rem;
    max-width: 120rem;
    margin: 0 auto;

    @media (max-width: 1024px) {
        grid-template-columns: 1.5fr 1fr 1fr;
        gap: 2rem;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
`;

const LogoCol = styled.div`
    display: flex;
    flex-direction: column;

    .footer-logo {
        display: block;
        margin-bottom: 2rem;

        .logo {
            width: 150px;
            height: auto;

            @media (max-width: 768px) {
                width: 120px;
            }
            @media (max-width: 480px) {
                width: 100px;
            }
        }
    }

    .social-links {
        list-style: none;
        display: flex;
        gap: 1.6rem;
        margin-bottom: 1.5rem;

        .social-icon {
            height: 2.2rem;
            width: 2.2rem;
            color: #4b5563;
            transition: color 0.3s;

            &:hover {
                color: #087f5b;
            }

            @media (max-width: 480px) {
                height: 2rem;
                width: 2rem;
            }
        }
    }

    .copyright {
        font-size: 1.4rem;
        line-height: 1.6;
        color: #6b7280;
        margin-top: auto;

        @media (max-width: 768px) {
            font-size: 1.2rem;
        }
        @media (max-width: 480px) {
            font-size: 1rem;
        }
    }
`;

const FooterCol = styled.div`
    .footer-heading {
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 2rem;
        color: #111827;

        @media (max-width: 768px) {
            font-size: 1.6rem;
            margin-bottom: 1.5rem;
        }
        @media (max-width: 480px) {
            font-size: 1.4rem;
            margin-bottom: 1rem;
        }
    }

    .contacts {
        font-style: normal;
        font-size: 1.6rem;
        line-height: 1.6;
        color: #374151;

        @media (max-width: 768px) {
            font-size: 1.4rem;
        }
        @media (max-width: 480px) {
            font-size: 1.2rem;
        }

        .address {
            margin-bottom: 1rem;
        }

        .footer-link {
            text-decoration: none;
            font-size: 1.6rem;
            color: #6b7280;
            transition: all 0.3s;

            &:hover {
                color: #087f5b;
            }

            @media (max-width: 768px) {
                font-size: 1.4rem;
            }
            @media (max-width: 480px) {
                font-size: 1.2rem;
            }
        }
    }

    .footer-nav {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 1.4rem;

        .footer-link {
            text-decoration: none;
            font-size: 1.6rem;
            color: #6b7280;
            transition: all 0.3s;

            &:hover {
                color: #087f5b;
            }

            @media (max-width: 768px) {
                font-size: 1.4rem;
            }
            @media (max-width: 480px) {
                font-size: 1.2rem;
            }
        }
    }
`;

export default function Footer() {
    return (
        <FooterContainer>
            <FooterGrid>
                <LogoCol>
                    <a href="#" className="footer-logo">
                        <img
                            className="logo"
                            src="/img/remotehub-logo.png"
                            alt="Remote Work Hub Logo"
                        />
                    </a>
                    <ul className="social-links">
                        <li>
                            <a href="#" className="footer-link">
                                <FaLinkedin className="social-icon" />
                            </a>
                        </li>
                        <li>
                            <a href="#" className="footer-link">
                                <BsTwitterX className="social-icon" />
                            </a>
                        </li>
                        <li>
                            <a href="#" className="footer-link">
                                <IoLogoGithub className="social-icon" />
                            </a>
                        </li>
                    </ul>
                    <p className="copyright">
                        © 2025 Remotic. All rights reserved.
                    </p>
                </LogoCol>

                <FooterCol>
                    <p className="footer-heading">Contact Us</p>
                    <address className="contacts">
                        <p className="address">
                            Barchi City, Kabul, Afghanistan
                        </p>
                        <p>
                            <a
                                className="footer-link"
                                href="tel:+93-700-123-456"
                            >
                                +93 781 598 774
                            </a>
                            <br />
                            <a
                                className="footer-link"
                                href="mailto:support@remoteworkhub.com"
                            >
                                support@remoic.com
                            </a>
                        </p>
                    </address>
                </FooterCol>

                <FooterCol>
                    <p className="footer-heading">For Job Seekers</p>
                    <ul className="footer-nav">
                        <li>
                            <Link className="footer-link" to="/">
                                Browse Jobs
                            </Link>
                        </li>
                        <li>
                            <a className="footer-link" href="#">
                                Apply Now
                            </a>
                        </li>
                        <li>
                            <a className="footer-link" href="#">
                                Dashboard
                            </a>
                        </li>
                    </ul>
                </FooterCol>

                <FooterCol>
                    <p className="footer-heading">For Employers</p>
                    <ul className="footer-nav">
                        <li>
                            <a className="footer-link" href="#">
                                Post Jobs
                            </a>
                        </li>
                        <li>
                            <a className="footer-link" href="#">
                                Find Talent
                            </a>
                        </li>
                        <li>
                            <a className="footer-link" href="#">
                                Careers
                            </a>
                        </li>
                    </ul>
                </FooterCol>

                <FooterCol>
                    <p className="footer-heading">Resources</p>
                    <ul className="footer-nav">
                        <li>
                            <a className="footer-link" href="#">
                                Help Center
                            </a>
                        </li>
                        <li>
                            <a className="footer-link" href="#">
                                Blog
                            </a>
                        </li>
                    </ul>
                </FooterCol>
            </FooterGrid>
        </FooterContainer>
    );
}
