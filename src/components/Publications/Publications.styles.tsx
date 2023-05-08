import styled from "styled-components";
import { mobile } from "../../responsive";

export const PublicationsHeadBanner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;

  ${mobile({
    flexDirection: "column",
  })}
`;
