import styled from "styled-components";
import { Laptop, tablet } from "../../responsive";

export const ApplicationsTabItems = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;

  ${Laptop({
    flexDirection: "column",
  })}
`;

export const ApplicationsTabItem = styled.button<{ isFilled: boolean }>`
  padding: 15px;
  background-color: ${(props) => (props.isFilled ? "#2b3513" : "#fff")};
  color: ${(props) => (props.isFilled ? "#fff" : "#2b3513")};
  box-shadow: 0px 8px 10px #ddd;
  outline: none;
  border: none;
  font-weight: 700;
  font-size: 20px;
  border-radius: 5px;
  cursor: pointer;
`;

export const ApplicationFilter = styled.select`
  outline: none;
  border: 1px solid #2b3513;
  padding: 18px 0px;
  width: 200px;
  text-align: center;
  border-radius: 5px;
  color: #2b3513;

  svg {
    color: #2b3513;
  }
`;

export const ProspectiveMembersFormContainer = styled.div`
  margin: 50px 0px;
  input {
    width: 100%;
  }
  textarea {
    width: 100%;
    height: 200px;
  }
  p {
    text-align: center;
  }
  .darkend {
    background-color: #2b3513;
    color: #fff;
    text-align: left;
    padding: 10px 5px;
  }
`;

export const CustomButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 80px 0px;
  gap: 30px;
`;

export const NavigationBtnContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin: 50px 0px;
  justify-content: center;

  ${tablet({
    flexDirection: "column",
  })};
`;

export const NavigationBtn = styled.button<{ isFilled: boolean }>`
  padding: 5px 10px;
  outline: none;
  border: 1px solid #2b3513;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isFilled ? "#2b3513" : "#fff")};
  color: ${(props) => (props.isFilled ? "#fff" : "#2b3513")};
`;

export const ApprovalMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50vh;

  h1 {
    font-weight: 500;
    color: #2b3513;
  }

  p {
    font-weight: 400;
    font-size: 18px;
    margin: 10px 0px;
  }
`;
