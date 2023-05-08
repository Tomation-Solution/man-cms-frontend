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
  padding-left: 30px;
  padding-right: 30px;
  overflow: hidden;

  .title-add-more {
    display: flex;
    padding: 20px 0px;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    ${tablet({
      flexDirection: "column",
    })}
  }

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
    height: calc(100% - 30%);
    ${mobile({
      height: "calc(100% - 50%)",
    })}
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

export const GalleryItemDeleteContainer = styled.div`
  border-radius: 10px;
  background-color: #fff;
  width: 50%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  .gallery-sides {
    display: flex;
    gap: 20px;

    ${tablet({
      flexDirection: "column",
    })}
  }

  p {
    font-size: 20px;
    font-weight: 600;
  }

  ${mobile({
    width: "90%",
  })}
`;

export const GalleryItemAddEditContainer = styled.div`
  color: #2b3513;
  border-radius: 10px;
  background-color: #fff;
`;
