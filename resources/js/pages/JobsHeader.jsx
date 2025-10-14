import { useState } from "react";
import { IoFilterOutline } from "react-icons/io5";
import { RxCaretDown } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hook/AuthContext";

// ================= Styled Components =================
const HeaderWrapper = styled.div`
    max-width: 120rem;
    text-align: center;
    margin: 0 auto;
    margin-top: 1rem;
`;

const TopRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
`;

const SearchWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const StyledH2 = styled.h2`
    margin-right: 1.2rem;
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
`;

const SearchBar = styled.input`
    width: 25rem;
    padding: 1.2rem 1.6rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-grey-300);
    background-color: var(--color-grey-0);
    font-size: 1.6rem;
    box-shadow: var(--shadow-sm);
    &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: var(--shadow-md);
    }
`;

const FilterIcon = styled(IoFilterOutline)`
    font-size: 2.4rem;
    cursor: pointer;
    margin-left: 1.4rem;
`;

const Buttons = styled.div`
    display: flex;
    gap: 1.2rem;
`;

const NavBtn = styled(Link)`
    display: inline-block;
    padding: 1rem 1.6rem;
    font-weight: 600;
    font-size: 1.4rem;
    border-radius: 5px;
    text-decoration: none;
    transition: all 0.3s;
`;

const LoginBtn = styled(NavBtn)`
    color: #087f5b;
    border: 1px solid #087f5b;
    background-color: #fff;
    &:hover {
        background-color: #e6f2ef;
    }
`;

const SignUpBtn = styled(NavBtn)`
    background-color: #114a38;
    color: #fff;
    &:hover {
        background-color: #087f5b;
    }
`;

/* Filters Container */
const StyledSortWrapper = styled.div`
    border-bottom: 1px solid var(--color-grey-200);
    padding-bottom: 1rem;
`;

const StyledSortContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;

    max-height: ${(props) => (props.show ? "1000px" : "0")};
    opacity: ${(props) => (props.show ? 1 : 0)};
    overflow: hidden;
    transition: max-height 0.5s ease, opacity 0.5s ease;
`;

const FiltersWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
`;

const SelectWrapper = styled.div`
    position: relative;
    display: inline-block;
`;

const StyledSelect = styled.select`
    padding: 0.6rem 2rem 0.6rem 1rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-grey-300);
    font-size: 1.4rem;
    background-color: var(--color-grey-0);
    cursor: pointer;
    appearance: none;

    &:hover {
        border-color: var(--color-primary);
    }
    &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: var(--shadow-sm);
    }
`;

const CaretIcon = styled(RxCaretDown)`
    position: absolute;
    right: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 1.6rem;
    color: var(--color-grey-500);
`;

// ================= JobsHeader Component =================
export default function JobsHeader({
    searchTerm,
    setSearchTerm,
    locationFilter,
    setLocationFilter,
    levelFilter,
    setLevelFilter,
    typeFilter,
    setTypeFilter,
    educationFilter,
    setEducationFilter,
    companyFilter,
    setCompanyFilter,
    salaryFilter,
    setSalaryFilter,
    sortOption,
    setSortOption,
}) {
    const [showFilters, setShowFilters] = useState(true);
    const location = useLocation();
    const { user } = useAuth();

    const toggleFilters = () => setShowFilters((prev) => !prev);

    const isHomePage = location.pathname === "/";
    const isLoginPage = location.pathname === "/login";
    // const isRegisterPage = location.pathname === "/createAccount";

    const isRegisterPage =
        location.pathname.toLowerCase().includes("register-job-seeker") ||
        location.pathname.toLowerCase().includes("/register-employer");
    const isDashboard = location.pathname.includes("/app");
    const isJobDetailsPage = location.pathname.includes("/jobDetails");

    // --- Hide entire header for dashboard job details page ---
    if (isDashboard && isJobDetailsPage) return null;

    // Show filters/search only on Home or Dashboard pages (not Home → JobDetails)
    const showFiltersSection =
        isDashboard && !(isJobDetailsPage && !isHomePage);

    // Show login/signup buttons on Home, Login, Register, or Home → JobDetails
    const showAuthButtons =
        isHomePage ||
        isLoginPage ||
        isRegisterPage ||
        (isJobDetailsPage && !isDashboard);

    return (
        <HeaderWrapper>
            <TopRow>
                <SearchWrapper>
                    {(isHomePage || isLoginPage || isRegisterPage) && (
                        <StyledH2>Remote Work Hub</StyledH2>
                    )}
                    {showFiltersSection && (
                        <>
                            <SearchBar
                                type="search"
                                placeholder="Search for jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FilterIcon onClick={toggleFilters} />
                        </>
                    )}
                </SearchWrapper>

                {showAuthButtons && (
                    <Buttons>
                        <LoginBtn to="/login">Log in</LoginBtn>

                        <SignUpBtn to="/welcome">Sign up →</SignUpBtn>
                    </Buttons>
                )}
            </TopRow>

            {showFiltersSection && (
                <StyledSortWrapper>
                    <StyledSortContainer show={showFilters}>
                        <FiltersWrapper>
                            <SelectWrapper>
                                <StyledSelect
                                    value={locationFilter}
                                    onChange={(e) =>
                                        setLocationFilter(e.target.value)
                                    }
                                >
                                    <option value="">All Locations</option>
                                    <option value="USA">USA</option>
                                    <option value="Germany">Germany</option>
                                    <option value="UK">UK</option>
                                    <option value="Canada">Canada</option>
                                    <option value="India">India</option>
                                </StyledSelect>
                                <CaretIcon />
                            </SelectWrapper>

                            <SelectWrapper>
                                <StyledSelect
                                    value={levelFilter}
                                    onChange={(e) =>
                                        setLevelFilter(e.target.value)
                                    }
                                >
                                    <option value="">All Levels</option>
                                    <option value="Junior">Junior</option>
                                    <option value="Mid">Mid</option>
                                    <option value="Senior">Senior</option>
                                </StyledSelect>
                                <CaretIcon />
                            </SelectWrapper>

                            <SelectWrapper>
                                <StyledSelect
                                    value={typeFilter}
                                    onChange={(e) =>
                                        setTypeFilter(e.target.value)
                                    }
                                >
                                    <option value="">All Types</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                </StyledSelect>
                                <CaretIcon />
                            </SelectWrapper>

                            <SelectWrapper>
                                <StyledSelect
                                    value={educationFilter}
                                    onChange={(e) =>
                                        setEducationFilter(e.target.value)
                                    }
                                >
                                    <option value="">All Education</option>
                                    <option value="Bachelor">Bachelor</option>
                                    <option value="Master">Master</option>
                                    <option value="PhD">PhD</option>
                                </StyledSelect>
                                <CaretIcon />
                            </SelectWrapper>

                            <SelectWrapper>
                                <StyledSelect
                                    value={companyFilter}
                                    onChange={(e) =>
                                        setCompanyFilter(e.target.value)
                                    }
                                >
                                    <option value="">All Companies</option>
                                    <option value="Google">Google</option>
                                    <option value="Microsoft">Microsoft</option>
                                    <option value="Amazon">Amazon</option>
                                </StyledSelect>
                                <CaretIcon />
                            </SelectWrapper>

                            <SelectWrapper>
                                <StyledSelect
                                    value={salaryFilter}
                                    onChange={(e) =>
                                        setSalaryFilter(e.target.value)
                                    }
                                >
                                    <option value="">All Salary Types</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Hourly">Hourly</option>
                                </StyledSelect>
                                <CaretIcon />
                            </SelectWrapper>
                        </FiltersWrapper>

                        <SelectWrapper>
                            <StyledSelect
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="date">Sort by Date</option>
                                <option value="relevance">
                                    Sort by Relevance
                                </option>
                                <option value="location">
                                    Sort by Location
                                </option>
                                <option value="type">Sort by Job Type</option>
                                <option value="az">Sort A - Z</option>
                            </StyledSelect>
                            <CaretIcon />
                        </SelectWrapper>
                    </StyledSortContainer>
                </StyledSortWrapper>
            )}
        </HeaderWrapper>
    );
}
