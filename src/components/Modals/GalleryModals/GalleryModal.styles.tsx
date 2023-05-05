import styled from "styled-components";
import { mobile, tablet } from "../../../responsive";
import { seqBlue100 } from "../../../globals/colors";

export const GalleryModalContainer = styled.div`
  background-color: #fff;
  border-radius: 10px;
  height: 500px;
  width: 80%;
  color: ${seqBlue100};
  position: relative;
  padding-top: 30px;

  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;

    svg {
      font-size: 20px;
      cursor: pointer;
    }
  }
  .gallery-scroll {
    overflow-y: auto;
    height: calc(100%);
  }
  .gallery-modal-items {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .gallery-modal-item {
      padding: 10px;
      width: calc((100% - 60px) / 4);
      ${tablet({
        width: "calc((100% - 20px) / 2)",
      })}
      ${mobile({
        width: "100%",
      })}
      img {
        width: 100%;
        height: 200px;
        object-fit: contain;
      }
      p {
        font-size: 14px;
        text-align: center;
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
