import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import EmployerSidebar from "./EmployerSidebar";
import Header from "./Header";

const StyledAppLayout = styled.div`
    display: grid;
    grid-template-columns: ${(props) =>
        props.isOpen ? "26rem 1fr" : "6rem 1fr"};
    grid-template-rows: auto 1fr;
    height: 100vh;
    overflow: hidden;
    transition: grid-template-columns 0.3s ease;
`;

const HeaderWrapper = styled.header`
    grid-column: 1 / -1;
`;

const SidebarWrapper = styled.aside`
    grid-row: 2 / -1;
    grid-column: 1 / 2;
`;

const Main = styled.div`
    background-color: var(--color-grey-0);
    overflow-y: auto;
    border-left: 1px solid var(--color-grey-100);
`;

function EmployerAppLayout() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => setIsOpen((prev) => !prev);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsOpen(false); 
            } else {
                setIsOpen(true); 
            }
        };

        handleResize(); 
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <StyledAppLayout isOpen={isOpen}>
            <HeaderWrapper>
                <Header />
            </HeaderWrapper>

            <SidebarWrapper>
                <EmployerSidebar
                    isOpen={isOpen}
                    toggleSidebar={toggleSidebar}
                />
            </SidebarWrapper>

            <Main>
                <Outlet />
            </Main>
        </StyledAppLayout>
    );
}

export default EmployerAppLayout;
