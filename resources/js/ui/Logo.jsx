import styled from "styled-components";

const StyledLogo = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 1.4rem;
    padding: 1rem 0;
    margin-top: 1.4rem;
`;

const StyledName = styled.p`
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
        sans-serif;
    font-size: 2.8rem;
    font-weight: 600;
    color: #218c6b;
`;

const StyledImage = styled.img`
    height: 40px;
    width: auto;
    object-fit: contain;
`;


function Logo({ isOpen }) {
    return (
        <StyledLogo
            style={{
                gap: isOpen ? "1.4rem" : "0",
                justifyContent: isOpen ? "center" : "flex-start",
            }}
        >
            <StyledImage src="/remotic-logo3.png" alt="Remotic Logo" />
            {isOpen && <StyledName>Remotic</StyledName>}
        </StyledLogo>
    );
}

export default Logo;
