import styled from "styled-components";
import { seqWhite100 } from "../../globals/colors";
import { tablet } from "../../responsive";

export const MainContainer = styled.div`
  background-color: ${seqWhite100};
  width: calc(100% - 240px);
  float: right;
  min-height: 100vh;
  padding: 20px;

  ${tablet({
    width: "100%",
  })}
`;
