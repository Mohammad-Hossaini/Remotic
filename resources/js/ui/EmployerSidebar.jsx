import { useState } from "react";
import styled from "styled-components";
import EmployerMainnav from "./EmployerMainnav";

const StyledSidebar = styled.div`
    background-color: var(--color-grey-0);
    grid-row: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: ${(props) => (props.isOpen ? "flex-start" : "center")};
    width: ${(props) => (props.isOpen ? "26rem" : "6rem")};
    transition: width 0.3s ease, align-items 0.3s ease;
    overflow: hidden;

`;



function EmployerSidebar({ isOpen, toggleSidebar }) {
    return (
        <StyledSidebar isOpen={isOpen}>
            <EmployerMainnav isOpen={isOpen} toggleSidebar={toggleSidebar} />
        </StyledSidebar>
    );
}
export default EmployerSidebar