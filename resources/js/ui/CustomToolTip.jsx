import styled from "styled-components";

const TooltipCustom = styled.div`
    padding: 5px 10px;
    background: rgba(10, 19, 20, 0.5);
    backdrop-filter: blur(5px);
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    border-radius: 10px;
    > p {
        margin-bottom: 5px;
    }
    > div {
        display: flex;
        align-items: center;
    }
`;

const Color = styled.div`
    width: 15px;
    height: 15px;
    background: ${(props) => props.color};
    margin-right: 10px;
    border-radius: 5px;
    border: 2px solid #fff;
`;

function CustomToolTip({ active, payload, label }) {
    if (active && payload && payload.length) {
        const item = payload[0];

        // THIS IS THE REAL KEY NAME
        const keyName = item.name; // ← FIXED

        return (
            <TooltipCustom>
                <p>{label}</p>

                <div>
                    <Color color={item.color} />
                    {`${keyName}: ${item.value}`}
                </div>
            </TooltipCustom>
        );
    }

    return null;
}

export default CustomToolTip;
