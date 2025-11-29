import { RiMenu2Fill } from "react-icons/ri";
import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./Mainnav";

const StyledSidebar = styled.div`
    position: relative;
    padding: 0;
    /* border: 1px solid var(--color-grey-100); */
    grid-row: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: ${(props) => (props.isOpen ? "26rem" : "6rem")};
    transition: width 0.3s ease;
    overflow: hidden;
    height: 200%;
`;

const MenuButton = styled.button`
    position: fixed;
    top: 1.8rem;
    left: ${(props) =>
        props.isOpen ? "28rem" : "8rem"}; 
    background: none;
    border: none;
    color: #218c6b;
    font-size: 2.4rem;
    cursor: pointer;
    /* z-index: 1000;  */
    transition: all 0.3s ease;
    outline: none;
    &:focus {
        outline: none;
        box-shadow: 0 0 0 7px rgba(8, 127, 91, 0.4);
        transform: scale(1.05);
    }

    &:hover {
        color: #065a3f;
    }
`;

function Sidebar({ isOpen, toggleSidebar }) {
    return (
        <>
            <MenuButton isOpen={isOpen} onClick={toggleSidebar}>
                <RiMenu2Fill />
            </MenuButton>

            <StyledSidebar isOpen={isOpen}>
                <Logo isOpen={isOpen} />
                <MainNav isOpen={isOpen} />
            </StyledSidebar>
        </>
    );
}

export default Sidebar;
