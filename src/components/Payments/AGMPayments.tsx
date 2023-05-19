import React, { useState } from "react";
import { ContactMainContainer } from "../Modals/Modals.styles";
import InvitationSection from "./AGMComponents/InvitationSection";
import MembersSection from "./AGMComponents/MembersSection";
import ExhibitorsSection from "./AGMComponents/ExhibitorsSection";
import OthersSection from "./AGMComponents/OthersSection";
import LuncheonSection from "./AGMComponents/LuncheonBootsSection";

const AGMPayments = () => {
  const [options, setOptions] = useState("invitation");

  return (
    <>
      <ContactMainContainer>
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
              color: `${options === "luncheon" ? "#4FDE9D" : "#2b3513"}`,
              cursor: "pointer",
              borderRight: "1px solid #2b3513",
              flex: "0 0 200px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setOptions("luncheon")}
          >
            Luncheon Prices & Boots
          </span>
          <span
            style={{
              fontWeight: "500",
              color: `${options === "invitation" ? "#4FDE9D" : "#2b3513"}`,
              cursor: "pointer",
              borderRight: "1px solid #2b3513",
              flex: "0 0 200px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setOptions("invitation")}
          >
            Invitaions
          </span>
          <span
            style={{
              fontWeight: "500",
              color: `${options === "members" ? "#4FDE9D" : "#2b3513"}`,
              cursor: "pointer",
              borderRight: "1px solid #2b3513",
              flex: "0 0 200px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setOptions("members")}
          >
            Members Registrations
          </span>
          <span
            style={{
              fontWeight: "500",
              color: `${options === "exhibitor" ? "#4FDE9D" : "#2b3513"}`,
              cursor: "pointer",
              borderRight: "1px solid #2b3513",
              flex: "0 0 200px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setOptions("exhibitor")}
          >
            Exhibitors Registrations
          </span>
          <span
            style={{
              fontWeight: "500",
              color: `${options === "others" ? "#4FDE9D" : "#2b3513"}`,
              cursor: "pointer",
              borderRight: "1px solid #2b3513",
              flex: "0 0 200px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setOptions("others")}
          >
            Other Registrations Registrations
          </span>
        </div>

        {options === "luncheon" ? <LuncheonSection /> : null}
        {options === "invitation" ? <InvitationSection /> : null}
        {options === "members" ? <MembersSection /> : null}
        {options === "exhibitor" ? <ExhibitorsSection /> : null}
        {options === "others" ? <OthersSection /> : null}
      </ContactMainContainer>
    </>
  );
};

export default AGMPayments;
