import React from "react";
import { ContactContainer } from "../../Modals/Modals.styles";

export type OtherItemType = {
  id: number;
  event: number;
  ref: string;
  type: string;
  company_name: string;
  designation: string;
  name: string;
  email: string;
  phone_no: string;
  created_at: string;
  updated_at: string;
};

const OthersItem: React.FC<{ data: OtherItemType }> = ({ data }) => {
  return (
    <ContactContainer>
      <h1>{data.company_name}</h1>

      <p>
        <span className="darkend">AGM regisration reference number: </span>
        {data.ref}
      </p>

      <p>
        <span className="darkend">Registration Type: </span>
        {data.type}
      </p>

      <p>
        <span className="darkend">AGM event id: </span>
        {data.event}
      </p>

      <p>
        <span className="darkend">Company email: </span>
        {data.email}
      </p>

      <p>
        <span className="darkend">Company name: </span>
        {data.company_name}
      </p>
      <p>
        <span className="darkend">Designation: </span>
        {data.designation}
      </p>

      <p>
        <span className="darkend">Fullname: </span>
        {data.name}
      </p>

      <p>
        <span className="darkend">Phone number: </span>
        {data.phone_no}
      </p>
    </ContactContainer>
  );
};

export default OthersItem;
