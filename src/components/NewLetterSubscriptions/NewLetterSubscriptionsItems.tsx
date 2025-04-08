import React from "react";
import { ContactContainer } from "../Modals/Modals.styles";
import { datefromatter } from "../../utils/DateFormatter";

export interface NewLetterSubscriptionsType {
  id: number;
  ref: string;
  email: string;
  name: string;
  created_at: string;
  is_verified: boolean;
}

const NewLetterSubscriptionsItems: React.FC<{
  data: NewLetterSubscriptionsType;
}> = ({ data }) => {
  return (
    <ContactContainer>
      <h1>{data.email}</h1>
      <p>
        <span className="darkend">Newletter Subscription Number: </span>
        {data.ref}
      </p>
      <p>
        <span className="darkend">Date Sent: </span>
        {datefromatter(new Date(data.created_at))}
      </p>
    </ContactContainer>
  );
};

export default NewLetterSubscriptionsItems;
