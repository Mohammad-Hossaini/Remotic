
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: ${(props) => (props.isSidebarOpen ? "26rem" : "6rem")} 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  overflow: hidden;
  transition: grid-template-columns 0.3s ease;
`;

const Main = styled.div`
  background-color: var(--color-grey-0);
  overflow-y: auto;
`;

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <StyledAppLayout isSidebarOpen={isSidebarOpen}>
      <Header />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Main>
        <Outlet />
      </Main>
    </StyledAppLayout>
  );
}

export default AppLayout;
