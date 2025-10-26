import { Outlet } from "react-router-dom";
import styled from "styled-components";
import EmployerSidebar from "./EmployerSidebar";
import Header from "./Header";

const StyledAppLayout = styled.div`
    display: grid;
    grid-template-columns: 26rem 1fr; /* Sidebar + Main */
    grid-template-rows: auto 1fr; /* Header + Content */
    height: 100vh;
    overflow: hidden;
`;

const HeaderWrapper = styled.header`
    grid-column: 1 / -1; /* Header spans both columns */
`;

const SidebarWrapper = styled.aside`
    grid-row: 2 / -1;
    grid-column: 1 / 2;
`;

const Main = styled.main`
    grid-row: 2 / -1;
    grid-column: 2 / -1;
    background-color: var(--color-grey-0);
    overflow-y: auto;
`;

function EmployerAppLayout() {
    return (
        <StyledAppLayout>
            <HeaderWrapper>
                <Header />
            </HeaderWrapper>

            <SidebarWrapper>
                <EmployerSidebar />
            </SidebarWrapper>

            <Main>
                <Outlet />
            </Main>
        </StyledAppLayout>
    );
}

export default EmployerAppLayout;
