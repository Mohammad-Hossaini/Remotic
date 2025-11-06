import { BsBriefcase } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import { HiOutlineHeart } from "react-icons/hi";
import { MdOutlineBookmarkAdded } from "react-icons/md";

import { HiOutlineCheckCircle, HiOutlineHome } from "react-icons/hi2";

import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";

const NavList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding-top: 2rem;
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
        border-radius: var(--radius-sm);

        & svg {
            color: var(--color-brand-600);
        }
    }
`;

function MainNav({ isOpen, role = "jobseeker" }) {
    const navigate = useNavigate();
    const profilePath =
        role === "employer" ? "/employerApp/profile" : "/app/profile";

    return (
        <nav style={{ width: "100%" }}>
            <NavList>
                {[
                    {
                        path: "/app/jobSeekerDashboard",
                        icon: <HiOutlineHome />,
                        label: "Home",
                    },
                    {
                        path: "/app/allJobs",
                        icon: <BsBriefcase />,
                        label: "All Jobs",
                    },
                    {
                        path: "/app/savedJobs",
                        icon: <HiOutlineHeart />,
                        label: "Favorite Jobs",
                    },
                    {
                        path: "/app/appliedJobs",
                        icon: <HiOutlineCheckCircle />,
                        label: "Applied Jobs",
                    },
                    {
                        path: "/app/sugessteddJobs",
                        icon: <MdOutlineBookmarkAdded />,
                        label: "Suggested Jobs",
                    },
                    // {
                    //     path: "/app/application",
                    //     icon: <IoFolderOpenOutline />,
                    //     label: "Application",
                    // },
                    // {
                    //     path: "/app/messages",
                    //     icon: <TbMessage2Share />,
                    //     label: "Messages",
                    // },
                    {
                        path: profilePath,
                        icon: <FaRegUser />,
                        label: "Profile",
                    },
                ].map((item) => (
                    <li key={item.path}>
                        {/* <StyledNavLink to={item.path}>
                            {item.icon}
                            {isOpen && <span>{item.label}</span>}
                        </StyledNavLink> */}
                        <StyledNavLink to={item.path} isOpen={isOpen}>
                            {item.icon}
                            <span>{item.label}</span>
                        </StyledNavLink>
                    </li>
                ))}
            </NavList>
        </nav>
    );
}

export default MainNav;
