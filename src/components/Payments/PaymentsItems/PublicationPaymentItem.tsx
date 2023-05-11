import React from "react";
import { ContactContainer } from "../../Modals/Modals.styles";
import { datefromatter } from "../../../utils/DateFormatter";
import { formatMoney } from "../../../utils/moneyFormatter";

export type PublicationsPaymentType = {
  id: number;
  publication: number;
  ref: string;
  fullname: string;
  email: string;
  phone_number: string;
  company_name: string;
  amount_to_pay: string;
  is_verified: boolean;
  file_received: boolean;
  created_at: string;
};

const PublicationPaymentItem: React.FC<{ data: PublicationsPaymentType }> = ({
  data,
}) => {
  return (
    <ContactContainer>
      <h1>{data.company_name}</h1>
      <p>
        <span className="darkend">Publication paymennt reference number: </span>
        {data.ref}
      </p>

      <p>
        <span className="darkend">Id of publication bought:</span>
        {data.publication}
      </p>

      <p>
        <span className="darkend">Email: </span>
        {data.email}
      </p>

      <p>
        <span className="darkend">Fullname: </span>
        {data.fullname}
      </p>

      <p>
        <span className="darkend">Phone number: </span>
        {data.phone_number}
      </p>

      <p>
        <span className="darkend">Publication price: </span>
        {formatMoney(data.amount_to_pay)}
      </p>

      <p>
        <span className="darkend">Payment verification status: </span>
        {data.is_verified ? "confirmed" : "not confirmed"}
      </p>

      <p>
        <span className="darkend">Publication file delivery status: </span>
        {data.file_received ? "received" : "not received"}
      </p>

      <p>
        <span className="darkend">Payment initialization date: </span>
        {datefromatter(new Date(data.created_at))}
      </p>
    </ContactContainer>
  );
};

export default PublicationPaymentItem;
