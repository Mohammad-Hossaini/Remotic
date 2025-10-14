import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerWrapper = styled.div`
    width: ${(props) => props.size || "18px"};
    height: ${(props) => props.size || "18px"};
    border: 2px solid ${(props) => props.color || "#fff"};
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
`;

export default function Spinner({ size, color }) {
    return <SpinnerWrapper size={size} color={color} />;
}
