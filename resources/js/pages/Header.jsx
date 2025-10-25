import { useEffect, useRef, useState } from "react";
import { TfiClose, TfiMenu } from "react-icons/tfi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

/* ==============================
   STYLED COMPONENTS
============================== */

const HeaderContainer = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 8rem;
    padding: 0 8rem 0 4.8rem;
    background-color: #e6f2ef;
    position: relative;
    z-index: 1000;
    transition: all 0.3s;

    &.sticky {
        position: fixed;
        top: 0;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.97);
        box-shadow: 0 1.2rem 3.2rem rgba(0, 0, 0, 0.03);
        z-index: 999;
    }

    @media (max-width: 59em) {
        padding: 0 3.2rem;
    }
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    img {
        width: 100px;
        height: auto;
        object-fit: contain;
        display: block;
    }

    @media (max-width: 59em) {
        img {
            width: 110px;
        }
    }
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
        backdrop-filter: blur(2px);
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
        transform: ${({ isOpen }) =>
            isOpen ? "translateX(0)" : "translateX(100%)"};

        ul {
            flex-direction: column;
            gap: 3rem;
            text-align: center;
        }
    }
`;

const NavItem = styled.a`
    text-decoration: none;
    color: #111827;
    font-size: 1.4rem;
    font-weight: 600;
    transition: color 0.3s;

    &:hover {
        color: #087f5b;
    }
    &:focus {
        outline: none;
        box-shadow: 0 0 0 7px rgba(8, 127, 91, 0.4);
        transform: scale(1.05);
    }
`;

const Buttons = styled.div`
    display: flex;
    gap: 2.4rem;

    @media (max-width: 59em) {
        display: none;
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

    &:hover {
        background-color: #e6f2ef;
        box-shadow: inset 0 0 0 3px #fff;
    }

    @media (max-width: 75em) {
        display: none;
    }

    @media (max-width: 59em) {
        background-color: #114a38;
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
            display: inline-block !important;
        }
    }
`;

const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    display: none;

    &:focus {
        outline: none;
        box-shadow: 0 0 0 7px rgba(8, 127, 91, 0.4);
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
    color: #114a38;
    transition: all 0.3s;

    &:hover {
        transform: scale(1.1);
        color: #087f5b;
    }
`;

const CloseIcon = styled(TfiClose)`
    font-size: ${iconSize};
    color: #114a38;
    transition: all 0.3s;

    &:hover {
        transform: rotate(90deg);
        color: #087f5b;
    }
`;

/* ==============================
   HEADER COMPONENT
============================== */

export default function Header({ heroRef }) {
    const location = useLocation();
    const navigate = useNavigate();
    const isMainPage = location.pathname === "/home";
    const isHomePage = location.pathname === "/";
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const headerRef = useRef(null);

    // ✅ Toggle mobile nav
    const toggleNav = () => {
        setIsNavOpen((prev) => {
            document.body.style.overflow = !prev ? "hidden" : "auto";
            return !prev;
        });
    };

    // ✅ Close mobile nav when link clicked
    const closeNav = () => {
        setIsNavOpen(false);
        document.body.style.overflow = "auto";
    };

    // ✅ Smooth scroll or navigate for Home
    const handleHomeClick = (e) => {
        e.preventDefault();

        if (isMainPage) {
            // Smooth scroll to hero
            const hero = document.querySelector("#hero");
            if (hero) hero.scrollIntoView({ behavior: "smooth" });
        } else if (isHomePage) {
            // Navigate to /home
            navigate("/home");
        } else {
            // Default go to home page
            navigate("/home");
        }

        closeNav();
    };

    // ✅ Sticky nav behavior
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsSticky(!entry.isIntersecting),
            { root: null, threshold: 0, rootMargin: "-80px" }
        );

        if (heroRef?.current) observer.observe(heroRef.current);

        return () => {
            if (heroRef?.current) observer.unobserve(heroRef.current);
        };
    }, [heroRef]);

    return (
        <HeaderContainer ref={headerRef} className={isSticky ? "sticky" : ""}>
            <LogoContainer>
                <Link to="/">
                    <img src="/remotic-logo2.png" alt="Remotic Logo" />
                </Link>
            </LogoContainer>

            <Nav isOpen={isNavOpen}>
                <ul>
                    <li>
                        <NavItem href="#hero" onClick={handleHomeClick}>
                            Home
                        </NavItem>
                    </li>

                    {isMainPage && (
                        <>
                            <li>
                                <NavItem
                                    href="#sit-features"
                                    onClick={closeNav}
                                >
                                    Features
                                </NavItem>
                            </li>
                            <li>
                                <NavItem href="#testimonial" onClick={closeNav}>
                                    Testimonial
                                </NavItem>
                            </li>
                            <li>
                                <NavItem href="#pricing" onClick={closeNav}>
                                    Pricing
                                </NavItem>
                            </li>
                            <li>
                                <NavItem href="#fac" onClick={closeNav}>
                                    FAQ
                                </NavItem>
                            </li>
                            <li>
                                <NavItem href="#cta" onClick={closeNav}>
                                    Contact
                                </NavItem>
                            </li>
                        </>
                    )}
                </ul>

                <MobileButtons>
                    <LoginBtn to="/login" onClick={closeNav}>
                        Log in
                    </LoginBtn>
                    <SignUpBtn to="/welcome" onClick={closeNav}>
                        Sign up →
                    </SignUpBtn>
                </MobileButtons>
            </Nav>

            <Buttons>
                <LoginBtn to="/login">Log in</LoginBtn>
                <SignUpBtn to="/welcome">Sign up →</SignUpBtn>
            </Buttons>

            <IconButton onClick={toggleNav}>
                {isNavOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
        </HeaderContainer>
    );
}
