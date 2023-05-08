import styled from "styled-components";
import { seqBlue100 } from "../../../globals/colors";

export const EditPublicationContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  color: ${seqBlue100};

  .publications-items {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0px;

    .publication-items-btn {
      gap: 10px;
      display: flex;
      align-items: center;
    }
  }
`;
