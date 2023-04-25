import styled from "styled-components";
import { tablet } from "../../responsive";

export const ModalsContainer = styled.div`
  padding: 20px;

  input {
    width: 100%;
    background-color: #fff;
    color: #000;
  }
  select {
    width: 100%;
    background-color: #fff;
    color: #000;
  }
  textarea {
    width: 100%;
    height: 200px;
    background-color: #fff;
    color: #000;
  }
`;

export const ContactMainContainer = styled.div`
  margin: 20px 0px;
  /* display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;

  ${tablet({
    gridTemplateColumns: "auto",
  })} */
`;
export const ContactContainer = styled.div`
  margin: 20px 0px;
  padding: 10px;
  background-color: #fff;
  color: #2b3513;
  border-radius: 5px;

  h1 {
    font-weight: 400;
    margin: 10px 0px;
  }

  .darkend {
    font-weight: 700;
  }
  p {
    font-size: 15px;
    margin: 5px 0px;
    line-height: 20px;
  }

  span {
    margin: 10px 0px;
  }
`;
