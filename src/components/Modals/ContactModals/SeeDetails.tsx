import React from "react";
import { DataType } from "../../AboutUs/Contacts";
import { ContactContainer } from "../Modals.styles";
import { datefromatter } from "../../../utils/DateFormatter";

const SeeDetails: React.FC<{ data: DataType }> = ({ data }) => {
  return (
    <ContactContainer>
      <h1>{data.name}</h1>
      <p>
        <span className="darkend">Date Sent: </span>
        {datefromatter(new Date(data.created_at))}
      </p>
      <p>
        <span className="darkend">Email: </span>
        {data.email}
      </p>
      <p>
        <span className="darkend">Phone No: </span>
        {data.phone_no}
      </p>
      <p>
        <span className="darkend">Subject: </span>
        {data.subject}
      </p>
      <p>
        <span className="darkend">Message: </span>
        {data.message}
      </p>
    </ContactContainer>
  );
};

export default SeeDetails;
