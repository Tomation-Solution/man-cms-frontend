import styled from "styled-components";
import { seqLightBlue, seqWhite, seqWhite100 } from "../../../globals/colors";
import { mobile, mobileSm, tablet } from "../../../responsive";

export const MainNavContainer = styled.div`
  padding: 10px;
  background-color: ${seqWhite};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  ${mobile({
    flexDirection: "column",
    gap: "20px",
  })}
`;

export const MainNavLogoCon = styled.div`
  display: none;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  ${tablet({
    display: "flex",
  })}

  img {
    width: 100px;
    height: 50px;
    object-fit: contain;
  }
`;

export const MainNavContentHolder = styled.div`
  display: flex;
  gap: 20px;

  ${mobileSm({
    flexDirection: "column",
  })}
`;
export const MainNavDropDown = styled.div`
  border-radius: 10px;
  padding: 10px;
  border: 1px solid ${seqLightBlue};
  background-color: ${seqWhite100};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  p {
    font-size: 14px;
    margin-right: 10px;
  }

  svg {
    color: ${seqLightBlue};
    margin-right: 5px;
  }
`;

export const MainNavProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  p {
    font-size: 14px;
  }
  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    border-radius: 50%;
    cursor: pointer;
  }
  svg {
    cursor: pointer;
  }
`;
