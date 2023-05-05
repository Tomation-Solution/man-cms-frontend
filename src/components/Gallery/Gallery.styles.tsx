import styled from "styled-components";
import { seqBlue100 } from "../../globals/colors";
import { mobile, tablet } from "../../responsive";

export const GalleryContainer = styled.div`
  color: ${seqBlue100};
  .gallery-items {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    .gallery-item {
      cursor: pointer;
      width: calc((100% - 60px) / 4);
      ${tablet({
        width: "calc((100% - 20px) / 2)",
      })}
      ${mobile({
        width: "100%",
      })}
      border: 2px dashed ${seqBlue100};
      padding: 20px;
      transition: all 0.5s;
      &:hover {
        border: 2px solid ${seqBlue100};
      }

      p {
        font-weight: 700;
        font-size: 18px;
      }
      .gallery-modal-btn {
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: space-evenly;
      }
    }
  }
`;
