import React, { useState } from "react";
import PublicationPayments from "../components/Payments/PublicationPayments";
import TrainingsEventsPayments from "../components/Payments/TrainingsEventsPayments";
import AGMPayments from "../components/Payments/AGMPayments";
import { useAuthStore } from "../zustand/store";
import { Navigate } from "react-router-dom";

const PaymentsPage = () => {
  const [options, setOptions] = useState("publication");

  const userData = useAuthStore.getState().user;

  if (
    !["super_user", "registrations_payments"].includes(
      String(userData?.user_type)
    )
  ) {
    return <Navigate to="/unauthorized" />;
  }
  return (
    <>
      <div
        style={{
          padding: "10px 5px",
          display: "flex",
          gap: "10px",
          overflowX: "auto",
        }}
      >
        <span
          style={{
            fontWeight: "500",
            color: `${options === "publication" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("publication")}
        >
          Publications
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "event-training" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("event-training")}
        >
          Events & Trainings Registrations
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "agm" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("agm")}
        >
          AGM
        </span>
      </div>
      <hr />
      <hr />

      {options === "publication" ? <PublicationPayments /> : null}
      {options === "event-training" ? <TrainingsEventsPayments /> : null}
      {options === "agm" ? <AGMPayments /> : null}
    </>
  );
};

export default PaymentsPage;
