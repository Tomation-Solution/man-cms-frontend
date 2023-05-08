import styled from "styled-components";

export const BackDropCon = styled.div<{ isOverlay: boolean }>`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${(props) => (props.isOverlay ? "6000" : "5000")};
  overflow-y: scroll;
`;
