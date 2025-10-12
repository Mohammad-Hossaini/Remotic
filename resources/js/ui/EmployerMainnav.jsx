import { BsBriefcase } from "react-icons/bs";
import { HiOutlineHome } from "react-icons/hi2";
import { IoFolderOpenOutline } from "react-icons/io5";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { TbMessage2Share } from "react-icons/tb";
import { NavLink } from "react-router-dom";

import styled from "styled-components";

const NavList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    border-top: 1px solid var(--color-grey-100);
    padding-top: 2rem;
`;

const StyledNavLink = styled(NavLink)`
    &:link,
    &:visited {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        color: var(--color-grey-600);
        font-size: 1.6rem;
        font-weight: 500;
        padding: 1.2rem 2.4rem;
        transition: all 0.3s;
    }

    &:hover,
    &:active,
    &.active:link,
    &.active:visited {
        color: var(--color-grey-800);
        background-color: var(--color-grey-30);
        border-radius: var(--border-radius-sm);
    }

    & svg {
        width: 2.4rem;
        height: 2.4rem;
        color: var(--color-grey-400);
        transition: all 0.3s;
    }

    &:hover svg,
    &:active svg,
    &.active:link svg,
    &.active:visited svg {
        color: var(--color-brand-600);
    }
`;

function MainNav() {
    // Get role dynamically from localStorage
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

    return (
        <nav>
            <NavList>
                <li>
                    <StyledNavLink to={dashboardPath}>
                        <HiOutlineHome />
                        <span>Home</span>
                    </StyledNavLink>
                </li>
                <li>
                    <StyledNavLink to={allJobsPath}>
                        <BsBriefcase />
                        <span>All Jobs</span>
                    </StyledNavLink>
                </li>
                <li>
                    <StyledNavLink to={postedJobsPath}>
                        <LuBriefcaseBusiness />
                        <span>Posted jobs</span>
                    </StyledNavLink>
                </li>
                <li>
                    <StyledNavLink to={applicationPath}>
                        <IoFolderOpenOutline />
                        <span>Application</span>
                    </StyledNavLink>
                </li>
                <li>
                    <StyledNavLink to={messagesPath}>
                        <TbMessage2Share />
                        <span>Messages</span>
                    </StyledNavLink>
                </li>
            </NavList>
        </nav>
    );
}

export default MainNav;
