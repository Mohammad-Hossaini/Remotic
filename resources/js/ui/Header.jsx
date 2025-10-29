import styled from "styled-components";
import Navbar from "../pages/navbar/Navbar";

const StyledHeader = styled.div`
    background-color: var(--color-grey-0);
    padding: 1.2rem 4.8rem;
    border-bottom: 1px solid var(--color-grey-50);
`;
function Header() {
    return (
        <StyledHeader>
            <Navbar />
        </StyledHeader>
    );
}

export default Header;
