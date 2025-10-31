// import "./Loader.css";

// function Loader({ position = "center", size = "medium" }) {
//     return (
//         <div className={`loader-container ${position}`}>
//             <div className={`loader ${size}`}></div>
//         </div>
//     );
// }

// export default Loader;

import "./Loader.css";

const Loader = ({ center = false, style = {} }) => {
    return (
        <div
            className={`loader-wrapper ${center ? "centered" : ""}`}
            style={style}
        >
            <div className="custom-loader">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className={`bar bar${i + 1}`}></div>
                ))}
            </div>
        </div>
    );
};

export default Loader;
