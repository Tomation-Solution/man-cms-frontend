import React from "react";
import { ContactContainer } from "../../Modals/Modals.styles";
import { formatMoney } from "../../../utils/moneyFormatter";
import { datefromatter } from "../../../utils/DateFormatter";

export type TrainingsEventPaymentType = {
  id: number;
  training: number | null;
  event: number | null;
  ref: string;
  fullname: string;
  email: string;
  phone_number: string;
  company_name: string;
  type: string;
  amount_to_pay: string;
  is_verified: boolean;
  created_at: string;
};

const TrainingsEventsPaymentItem: React.FC<{
  data: TrainingsEventPaymentType;
}> = ({ data }) => {
  const eventOrTraining = data.type === "EVENT" ? "Event" : "Training";
  return (
    <ContactContainer>
      <h1>{data.company_name}</h1>

      <p>
        <span className="darkend">
          {eventOrTraining} registration reference number:{" "}
        </span>
        {data.ref}
      </p>

      <p>
        <span className="darkend">Fullname: </span>
        {data.fullname}
      </p>

      <p>
        <span className="darkend">Email: </span>
        {data.email}
      </p>

      <p>
        <span className="darkend">Phone number: </span>
        {data.phone_number}
      </p>

      <p>
        <span className="darkend">{eventOrTraining} price: </span>
        {formatMoney(data.amount_to_pay)}
      </p>

      <p>
        <span className="darkend">
          {eventOrTraining} registration verification status:{" "}
        </span>
        {data.is_verified ? "confirmed" : "not confirmed"}
      </p>

      <p>
        <span className="darkend">Registration Initialization Date: </span>
        {datefromatter(new Date(data.created_at))}
      </p>
    </ContactContainer>
  );
};

export default TrainingsEventsPaymentItem;
