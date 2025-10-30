import { useEffect, useRef, useState } from "react";
import { IoIosMoon, IoIosSunny } from "react-icons/io";
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
    background-color: var(--color-grey-50);
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

    /* 🌙 Dark mode adjustments */
    [data-theme="dark"] & {
        background-color: var(--color-grey-30);
        .sticky {
            background-color: rgba(30, 30, 30, 0.95);
            box-shadow: 0 1.2rem 3.2rem rgba(0, 0, 0, 0.5);
        }
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
        transition: filter 0.3s;
    }

    @media (max-width: 59em) {
        img {
            width: 110px;
        }
    }

    /* 🌙 Dark mode logo filter */
    [data-theme="dark"] & img {
        filter: brightness(0) invert(1);
    }
`;

const Nav = styled.nav`
    ul {
        display: flex;
        list-style: none;
        gap: 2.4rem;
        align-items: center;
    }

    @media (max-width: 59em) {
        position: absolute;
        top: 0;
        right: 0;
        background-color: var(--color-grey-30);
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
    color: var(--color-grey-900);
    font-size: 1.4rem;
    font-weight: 600;
    transition: color 0.3s;

    &:hover {
        color: var(--color-primary);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 7px rgba(8, 127, 91, 0.4);
        transform: scale(1.05);
    }

    /* 🌙 Dark mode color fix */
    [data-theme="dark"] & {
        color: #f3f4f6; 
        &:hover {
            color: var(--color-primary);
        }
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

    /* 🌙 Dark mode adjustments */
    [data-theme="dark"] & {
        color: var(--color-grey-100);
        background-color: var(--color-grey-800);
        &:hover {
            background-color: var(--color-grey-700);
        }
    }
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

    /* 🌙 Dark mode adjustments (fix contrast) */
    [data-theme="dark"] & {
        color: #111827; 
        background-color: var(--color-primary);
        &:hover {
            background-color: var(--color-primary-light);
            box-shadow: none;
        }
    }
`;
const SignUpBtn = styled(NavBtn)`
    background-color: #114a38;
    color: #fff;

    &:hover {
        background-color: #087f5b;
    }

    /* 🌙 Dark mode adjustments */
    [data-theme="dark"] & {
        background-color: var(--color-primary);
        color: #fff;
        &:hover {
            background-color: var(--color-primary-light);
        }
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

    /* 🌙 Dark mode adjustments */
    [data-theme="dark"] & {
        color: #fff;
        &:hover {
            color: var(--color-primary-light);
        }
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

    /* 🌙 Dark mode adjustments */
    [data-theme="dark"] & {
        color: #fff;
        &:hover {
            color: var(--color-primary-light);
        }
    }
`;

const ThemeButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 2.4rem;
    color: #114a38;
    transition: color 0.3s;
    display: flex;
    align-items: center;

    &:hover {
        color: #087f5b;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 7px rgba(8, 127, 91, 0.4);
        transform: scale(1.05);
    }

    @media (max-width: 59em) {
        display: flex;
        position: absolute;
        top: 2rem;
        left: 2rem;
        z-index: 3000;
    }

    /* 🌙 Dark mode adjustments */
    [data-theme="dark"] & {
        color: #fff;
        &:hover {
            color: var(--color-primary-light);
        }
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
    const isEmployerPage = location.pathname === "/employerApp/allJobs";
    const isJobSeekerPage = location.pathname === "/app/allJobs";

    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );
    const headerRef = useRef(null);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const toggleNav = () => {
        setIsNavOpen((prev) => {
            document.body.style.overflow = !prev ? "hidden" : "auto";
            return !prev;
        });
    };

    const closeNav = () => {
        setIsNavOpen(false);
        document.body.style.overflow = "auto";
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        if (isMainPage) {
            const hero = document.querySelector("#hero");
            if (hero) hero.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate("/home");
        }
        closeNav();
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!heroRef?.current) setIsSticky(window.scrollY > 80);
        };

        const observer = heroRef?.current
            ? new IntersectionObserver(
                  ([entry]) => setIsSticky(!entry.isIntersecting),
                  { root: null, threshold: 0, rootMargin: "-80px" }
              )
            : null;

        if (heroRef?.current) observer.observe(heroRef.current);
        else window.addEventListener("scroll", handleScroll);

        return () => {
            if (heroRef?.current) observer.unobserve(heroRef.current);
            else window.removeEventListener("scroll", handleScroll);
        };
    }, [heroRef]);

    return (
        <>
            {!isEmployerPage && !isJobSeekerPage && (
                <HeaderContainer
                    ref={headerRef}
                    className={isSticky ? "sticky" : ""}
                >
                    <LogoContainer>
                        <Link to="/">
                            <img src="/remotic-logo2.png" alt="Remotic Logo" />
                        </Link>
                    </LogoContainer>

                    <ThemeButton onClick={toggleTheme}>
                        {theme === "light" ? <IoIosMoon /> : <IoIosSunny />}
                    </ThemeButton>

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
                                        <NavItem
                                            href="#testimonial"
                                            onClick={closeNav}
                                        >
                                            Testimonial
                                        </NavItem>
                                    </li>
                                    <li>
                                        <NavItem
                                            href="#pricing"
                                            onClick={closeNav}
                                        >
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
            )}
        </>
    );
}
