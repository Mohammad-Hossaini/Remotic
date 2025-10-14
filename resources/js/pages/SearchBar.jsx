import "./searchBar.css";

export default function SearchBar({
    searchTerm,
    setSearchTerm,
    locationFilter,
    setLocationFilter,
    onApply,
}) {
    return (
        <div className="main-container">
            <div className="content-container">
                <div className="text-container">
                    <h1 className="text-title">Find Exciting Jobs Today.</h1>
                    <p className="text-desc">
                        Get the most exciting jobs from all around the world and
                        grow your career fast with others.
                    </p>
                    <p className="pop-search">
                        <strong>Popular Search :</strong> Software Developer ,
                        UX Designer , Mobile Developer.
                    </p>
                </div>

                <div className="img-container">
                    <img
                        src="/bg-image_3_-removebg-preview.png"
                        alt=""
                        className="search-img"
                    />
                </div>

                {/* 🔹 جعبه سرچ */}
                <div className="search-container">
                    <form
                        className="search-form"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        {/* فیلد Type */}
                        <div className="first-input">
                            <label className="type-label">Type</label>
                            <input
                                type="text"
                                className="type-input"
                                placeholder="Enter job type!"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* فیلد Location */}
                        <div className="first-input">
                            <label className="type-label">Location</label>
                            <input
                                type="text"
                                className="type-input"
                                placeholder="Enter location!"
                                value={locationFilter}
                                onChange={(e) =>
                                    setLocationFilter(e.target.value)
                                }
                            />
                        </div>
                    </form>

                    <div className="apply-buttons">
                        <button onClick={onApply}>Apply</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
