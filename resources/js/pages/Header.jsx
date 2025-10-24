import { useState } from "react";
import { TfiClose, TfiMenu } from "react-icons/tfi";
import { Link } from "react-router-dom";
import styled from "styled-components";

/*==============================
  STYLED COMPONENTS
==============================*/

const HeaderContainer = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 8rem;
    padding: 0 8rem;
    background-color: #e6f2ef;
    position: relative;
    z-index: 1000;

    @media (max-width: 59em) {
        padding: 0 3.2rem;
    }
`;

const Logo = styled.div``;

const WebsiteName = styled.h2`
    font-size: 2.4rem;
    font-weight: 800;
    color: #111827;
`;

const Nav = styled.nav`
    ul {
        display: flex;
        list-style: none;
        gap: 2.4rem;
    }

    @media (max-width: 59em) {
        position: absolute;
        top: 0;
        right: 0;
        background-color: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(2px); /* ✅ Reduced blur */
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        transition: all 0.4s ease-in-out;
        opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
        pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
        visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
        transform: translateX(${({ isOpen }) => (isOpen ? "0" : "100%")});

        ul {
            flex-direction: column;
            gap: 3rem;
            text-align: center;
        }
    }
`;

const NavItem = styled(Link)`
    text-decoration: none;
    color: #111827;
    font-size: 1.8rem;
    font-weight: 600;
    transition: color 0.3s;

    &:hover {
        color: #087f5b;
    }
`;

const Buttons = styled.div`
    display: flex;
    gap: 2.4rem;

    @media (max-width: 59em) {
        display: none; /* hide desktop buttons on mobile */
    }
`;

const NavBtn = styled(Link)`
    display: inline-block;
    padding: 1.2rem 1.8rem;
    font-weight: 600;
    font-size: 1.4rem;
    border-radius: 5px;
    text-decoration: none;
    transition: all 0.3s;
`;

const LoginBtn = styled(NavBtn)`
    color: #114a38;
    background-color: #fff;
    /* border: 2px solid #114a38; */

    &:hover {
        background-color: #e6f2ef;
        box-shadow: inset 0 0 0 3px #fff;
    }

    @media (max-width: 59em) {
        background-color: #114a38; /* ✅ Dark background for visibility */
        color: #fff;
        border: none;
        &:hover {
            background-color: #087f5b;
        }
    }
`;

const SignUpBtn = styled(NavBtn)`
    background-color: #114a38;
    color: #fff;

    &:hover {
        background-color: #087f5b;
    }

    @media (max-width: 59em) {
        background-color: #087f5b;
    }
`;

const MobileButtons = styled.div`
    display: none;

    @media (max-width: 59em) {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 4rem;

        a {
            min-width: 12rem;
            text-align: center;
            display: inline-block !important; /* ensure visible */
        }
    }
`;

const IconButton = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    display: none;
    border: none;
    outline: none;
    border-radius: 0.5rem;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(8, 127, 91, 0.4);
        transform: scale(1.05);
    }

    @media (max-width: 59em) {
        display: block;
        z-index: 2000;
    }
`;

const iconSize = "3.2rem";

const MenuIcon = styled(TfiMenu)`
    font-size: ${iconSize};
    width: ${iconSize};
    height: ${iconSize};
    color: #114a38;
    transition: all 0.3s;
    &:hover {
        transform: scale(1.1);
        color: #087f5b;
    }
`;

const CloseIcon = styled(TfiClose)`
    font-size: ${iconSize};
    width: ${iconSize};
    height: ${iconSize};
    color: #114a38;
    transition: all 0.3s;
    &:hover {
        transform: rotate(90deg);
        color: #087f5b;
    }
`;

/*==============================
  COMPONENT
==============================*/

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen((prev) => !prev);
        document.body.style.overflow = isNavOpen ? "auto" : "hidden";
    };

    return (
        <HeaderContainer>
            <Logo>
                <WebsiteName>Remotic</WebsiteName>
            </Logo>

            <Nav isOpen={isNavOpen}>
                <ul>
                    <li>
                        <NavItem to="/">Home</NavItem>
                    </li>
                    <li>
                        <NavItem to="/features">Features</NavItem>
                    </li>
                    <li>
                        <NavItem to="/testimonial">Testimonial</NavItem>
                    </li>
                    <li>
                        <NavItem to="/gallery">Gallery</NavItem>
                    </li>
                    <li>
                        <NavItem to="/faq">FAQ</NavItem>
                    </li>
                    <li>
                        <NavItem to="/contact">Contact</NavItem>
                    </li>
                </ul>

                {/* ✅ Mobile buttons appear below nav links */}
                <MobileButtons>
                    <LoginBtn to="/login">Log in</LoginBtn>
                    <SignUpBtn to="/createAccount">Sign up →</SignUpBtn>
                </MobileButtons>
            </Nav>

            <Buttons>
                <LoginBtn to="/login">Log in</LoginBtn>
                <SignUpBtn to="/createAccount">Sign up →</SignUpBtn>
            </Buttons>

            <IconButton onClick={toggleNav}>
                {isNavOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
        </HeaderContainer>
    );
}
