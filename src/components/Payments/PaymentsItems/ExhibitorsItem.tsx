import React from "react";
import { datefromatter } from "../../../utils/DateFormatter";
import { formatMoney } from "../../../utils/moneyFormatter";
import { ContactContainer } from "../../Modals/Modals.styles";

type Participant = {
  name: string;
  email: string;
  phone_no: string;
};

export type ExhibitorItemType = {
  id: number;
  event: number;
  participant: Participant[];
  luncheon_covered_participants: number;
  ref: string;
  email: string;
  company_name: string;
  company_address: string;
  amount_to_pay: string;
  boot: number[];
  is_verified: boolean;
  mail_recevied: boolean;
  created_at: string;
  updated_at: string;
};

const ExhibitorsItem: React.FC<{ data: ExhibitorItemType }> = ({ data }) => {
  return (
    <ContactContainer>
      <h1>{data.company_name}</h1>

      <p>
        <span className="darkend">AGM regisration reference number: </span>
        {data.ref}
      </p>

      <p>
        <span className="darkend"></span>
        {}
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
        <span className="darkend">
          Number of Luncheon Covered Participants:{" "}
        </span>
        {data.luncheon_covered_participants}
      </p>

      <section>
        {data.boot.map((item, index) => (
          <p key={index}>
            <span className="darkend">Id of Rented Boot: </span>
            {item}
          </p>
        ))}
      </section>

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
        <span className="darkend">AGM registration status: </span>
        {data.mail_recevied ? "received" : "not received"}
      </p>

      <p>
        <span className="darkend">Registration Initialization Date: </span>
        {datefromatter(new Date(data.created_at))}
      </p>

      <section>
        <br />
        <h3 style={{ textDecoration: "underline" }}>Participants</h3>
        {data.participant.map((item, index) => (
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
              <span className="darkend">Participant phone number: </span>
              {item.phone_no}
            </p>
          </div>
        ))}
      </section>
    </ContactContainer>
  );
};

export default ExhibitorsItem;
