import React from "react";
import { datefromatter } from "../../utils/DateFormatter";
import { ContactContainer } from "../Modals/Modals.styles";

export interface ServiceRequestType {
  id: number;
  ref: string;
  name: string;
  email: string;
  company_name: string;
  type: string;
  service: string;
  message: string;
  created_at: string;
}

const ServiceRequestItem: React.FC<{ data: ServiceRequestType }> = ({
  data,
}) => {
  return (
    <ContactContainer>
      <h1>{data.name}</h1>
      <p>
        <span className="darkend">Service Reference Number: </span>
        {data.ref}
      </p>
      <p>
        <span className="darkend">Date Sent: </span>
        {datefromatter(new Date(data.created_at))}
      </p>
      <p>
        <span className="darkend">Email: </span>
        {data.email}
      </p>
      <p>
        <span className="darkend">Company Name: </span>
        {data.company_name}
      </p>
      <p>
        <span className="darkend">Service Type: </span>
        {data.type}
      </p>
      <p>
        <span className="darkend">Service Name: </span>
        {data.service}
      </p>
      <p>
        <span className="darkend">Message: </span>
        {data.message}
      </p>
    </ContactContainer>
  );
};

export default ServiceRequestItem;
