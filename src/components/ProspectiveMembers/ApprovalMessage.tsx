import React from "react";
import { ApprovalMessageContainer } from "./ProspectiveMemers.styles";
import { AiFillCheckCircle } from "react-icons/ai";
import Button from "../Button/Button";

const ApprovalMessage: React.FC<{
  header?: string;
  message?: string;
  btncontent?: string;
}> = ({ header, message, btncontent }) => {
  return (
    <ApprovalMessageContainer>
      <AiFillCheckCircle />
      <h1>{header}</h1>
      <p>{message}</p>
      <Button>{btncontent}</Button>
    </ApprovalMessageContainer>
  );
};

export default ApprovalMessage;
