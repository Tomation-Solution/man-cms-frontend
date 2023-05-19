import React from "react";
import { ContactContainer } from "../../Modals/Modals.styles";
import { datefromatter } from "../../../utils/DateFormatter";

export type MakeQuickItemType = {
  id: number;
  company_name: string;
  designation: string;
  name: string;
  email: string;
  phone_no: string;
  created_at: string;
  updated_at: string;
};

const MakeQuickItem: React.FC<{ data: MakeQuickItemType }> = ({ data }) => {
  return (
    <ContactContainer>
      <h1>{data.company_name}</h1>

      <p>
        <span className="darkend">AGM regisration reference number: </span>
        {data.name}
      </p>

      <p>
        <span className="darkend">Company Email: </span>
        {data.email}
      </p>

      <p>
        <span className="darkend">Company Designation: </span>
        {data.designation}
      </p>

      <p>
        <span className="darkend">Company phone number: </span>
        {data.phone_no}
      </p>
    </ContactContainer>
  );
};

export default MakeQuickItem;
