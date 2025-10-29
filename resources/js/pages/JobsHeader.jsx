import { useState } from "react";
import { IoFilterOutline } from "react-icons/io5";
import { RxCaretDown } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

// ================= Styled Components =================
const HeaderWrapper = styled.div`
    max-width: 120rem;
    margin: 0 auto;
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const FilterIcon = styled(IoFilterOutline)`
    font-size: 2.4rem;
    cursor: pointer;
    margin-left: 1.5rem;
    border: 2px solid var(--color-grey-300);
    border-radius: 7px;
    padding: 0.2rem;
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
    width: 15rem;

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

const FiltersWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center; /* اضافه شده برای هم‌ترازی عمودی */
    margin-bottom: 1rem;
`;
const StyledSortContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    max-height: ${(props) => (props.show ? "1000px" : "0")};
    opacity: ${(props) => (props.show ? 1 : 0)};
    overflow: hidden;
    transition: max-height 0.5s ease, opacity 0.5s ease;
`;

// ================= JobsHeader Component =================
export default function JobsHeader({
    searchTerm,
    setSearchTerm,
    locationFilter,
    setLocationFilter,
    statusFilter,
    setStatusFilter,
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

    const toggleFilters = () => setShowFilters((prev) => !prev);

    const isEmployerPage = location.pathname === "/employerApp/allJobs";
    const isJobSeekerPage = location.pathname === "/app/allJobs";
    if (!isEmployerPage && !isJobSeekerPage) return null;

    return (
        <HeaderWrapper>
            <StyledSortContainer show={showFilters}>
                <FiltersWrapper>
                    {/* Status Filter */}
                    <SelectWrapper>
                        <StyledSelect
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="draft">Draft</option>
                        </StyledSelect>
                        <CaretIcon />
                    </SelectWrapper>

                    {/* Type Filter */}
                    <SelectWrapper>
                        <StyledSelect
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                            <option value="remote">Remote</option>
                        </StyledSelect>
                        <CaretIcon />
                    </SelectWrapper>

                    {/* Company Filter */}
                    <SelectWrapper>
                        <StyledSelect
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                        >
                            <option value="">All Companies</option>
                            <option value="Google">Google</option>
                            <option value="Microsoft">Microsoft</option>
                            <option value="Amazon">Amazon</option>
                        </StyledSelect>
                        <CaretIcon />
                    </SelectWrapper>

                    {/* Sort */}
                    <SelectWrapper>
                        <StyledSelect
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="relevance">Sort by Relevance</option>
                            <option value="location">Sort by Location</option>
                            <option value="type">Sort by Job Type</option>
                            <option value="az">Sort A - Z</option>
                        </StyledSelect>
                        <CaretIcon />
                    </SelectWrapper>
                </FiltersWrapper>
            </StyledSortContainer>

            <FilterIcon onClick={toggleFilters} />
        </HeaderWrapper>
    );
}
