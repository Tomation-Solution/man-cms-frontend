import React from "react";
import { ContactContainer } from "../../Modals/Modals.styles";

export type InvitationItemType = {
  id: number;
  type: string;
  company_name: string;
  email: string;
  is_valid: boolean;
  ref: string;
  created_at: string;
  updated_at: string;
};

const InvitationItem: React.FC<{ data: InvitationItemType }> = ({ data }) => {
  return (
    <ContactContainer>
      <h1>{data.company_name}</h1>

      <p>
        <span className="darkend">AGM regisration reference number: </span>
        {data.ref}
      </p>
      <p>
        <span className="darkend">Type: </span>
        {data.type}
      </p>
      <p>
        <span className="darkend">Email: </span>
        {data.email}
      </p>
      <p>
        <span className="darkend">Invitation Code Validity: </span>
        {data.is_valid ? "Unused" : "Used"}
      </p>
    </ContactContainer>
  );
};

export default InvitationItem;
