import { BsBriefcase } from "react-icons/bs";
import { HiOutlineHome } from "react-icons/hi2";
import { IoFolderOpenOutline } from "react-icons/io5";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { RiMenu2Fill } from "react-icons/ri";
import { TbMessage2Share } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NavWrapper = styled.nav`
    position: relative;
    width: 100%;
`;

const BurgerButton = styled.button`
    position: absolute;
    top: 1rem;
    right: ${(props) => (props.isOpen ? "1rem" : "50%")};
    transform: ${(props) => (!props.isOpen ? "translateX(50%)" : "none")};
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &:focus {
        outline: none;
        box-shadow: 0 0 0 7px rgba(8, 127, 91, 0.4);
        /* transform: scale(1.05); */
    }

    &:hover {
        color: #065a3f;
    }

    svg {
        font-size: 2.4rem;
        color: #218c6b;
    }
`;

const NavList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 4rem;
    width: 100%;
`;

const StyledNavLink = styled(NavLink)`
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.isOpen ? "flex-start" : "center")};
    gap: 1.2rem;
    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: ${(props) => (props.isOpen ? "1.2rem 2.4rem" : "1.2rem 0")};
    border-radius: var(--border-radius-sm);
    transition: all 0.3s;

    & svg {
        width: ${(props) => (props.isOpen ? "2.4rem" : "2.8rem")};
        height: ${(props) => (props.isOpen ? "2.4rem" : "2.8rem")};
        color: var(--color-grey-400);
        transition: all 0.3s;
    }

    span {
        display: ${(props) => (props.isOpen ? "inline" : "none")};
        transition: all 0.3s;
    }

    &:hover,
    &.active {
        color: var(--color-grey-800);
        background-color: var(--color-grey-30);

        & svg {
            color: var(--color-brand-600);
        }
    }
`;

function EmployerMainnav({ isOpen, toggleSidebar }) {
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    const role = currentUser?.role || "employer";

    const basePath = role === "employer" ? "/employerApp" : "/app";
    const profilePath = `${basePath}/profile`;
    const dashboardPath =
        role === "employer"
            ? `${basePath}/employerDashboard`
            : `${basePath}/jobSeekerDashboard`;
    const allJobsPath = `${basePath}/allJobs`;
    const messagesPath = `${basePath}/messages`;
    const applicationPath = `${basePath}/application`;
    const postedJobsPath = `${basePath}/postedJobs`;

    const navItems = [
        { path: dashboardPath, icon: <HiOutlineHome />, label: "Home" },
        { path: allJobsPath, icon: <BsBriefcase />, label: "All Jobs" },
        {
            path: postedJobsPath,
            icon: <LuBriefcaseBusiness />,
            label: "Posted Jobs",
        },
        {
            path: applicationPath,
            icon: <IoFolderOpenOutline />,
            label: "Application",
        },
        { path: messagesPath, icon: <TbMessage2Share />, label: "Messages" },
    ];

    return (
        <NavWrapper>
            <NavList>
                <BurgerButton isOpen={isOpen} onClick={toggleSidebar}>
                    <RiMenu2Fill />
                </BurgerButton>

                {navItems.map((item) => (
                    <li key={item.path}>
                        <StyledNavLink to={item.path} isOpen={isOpen}>
                            {item.icon}
                            <span>{item.label}</span>
                        </StyledNavLink>
                    </li>
                ))}
            </NavList>
        </NavWrapper>
    );
}

export default EmployerMainnav;
