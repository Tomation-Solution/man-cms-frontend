import React from "react";
import { ContactContainer } from "../../Modals/Modals.styles";
import { datefromatter } from "../../../utils/DateFormatter";
import { formatMoney } from "../../../utils/moneyFormatter";

type ParticipantDetailsType = {
  name: string;
  designation:
    | "memeber"
    | "exhibitor"
    | "exhibitor-participant"
    | "guest"
    | "media"
    | "staff";
  email: string;
  phone_no: string;
};

export type AGMPaymentType = {
  id: number;
  event: number;
  ref: string;
  email: string;
  company_name: string;
  company_address: string;
  is_verified: boolean;
  participant_details: ParticipantDetailsType[];
  amount_to_pay: string;
  created_at: string;
};

const AGMPaymentItem: React.FC<{ data: AGMPaymentType }> = ({ data }) => {
  return (
    <ContactContainer>
      <h1>{data.company_name}</h1>

      <p>
        <span className="darkend">AGM regisration reference number: </span>
        {data.ref}
      </p>

      <p>
        <span className="darkend">AGM event id: </span>
        {data.event}
      </p>

      <p>
        <span className="darkend">Companny email: </span>
        {data.email}
      </p>

      <p>
        <span className="darkend">Company address: </span>
        {data.company_address}
      </p>

      <p>
        <span className="darkend">AGM registration price: </span>
        {formatMoney(data.amount_to_pay)}
      </p>

      <p>
        <span className="darkend">AGM registration status: </span>
        {data.is_verified ? "confirmed" : "not confirmed"}
      </p>

      <p>
        <span className="darkend">Registration Initialization Date: </span>
        {datefromatter(new Date(data.created_at))}
      </p>

      <section>
        <br />
        <h3 style={{ textDecoration: "underline" }}>Participants</h3>
        {data.participant_details.map((item, index) => (
          <div key={index} style={{ marginLeft: "20px" }}>
            <h4 style={{ textDecoration: "underline" }}>
              Participant {index + 1}
            </h4>
            <p>
              <span className="darkend">Participant name: </span>
              {item.name}
            </p>

            <p>
              <span className="darkend">Participant email: </span>
              {item.email}
            </p>

            <p>
              <span className="darkend">Participant designation: </span>
              {item.designation}
            </p>

            <p>
              <span className="darkend">Participant phone number: </span>
              {item.phone_no}
            </p>
          </div>
        ))}
      </section>
    </ContactContainer>
  );
};

export default AGMPaymentItem;
