import React, { useState } from "react";
import WhyJoin from "../components/Membership/WhyJoin";
import JoinStep from "../components/Membership/JoinStep";
import FAQS from "../components/Membership/FAQS";
import OurMembers from "../components/Membership/OurMembers";

const MembershipPage = () => {
  const [options, setOptions] = useState("why-join");
  return (
    <>
      <div
        style={{
          padding: "10px 5px",
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          // width: "100%",
        }}
      >
        <span
          style={{
            fontWeight: "500",
            color: `${options === "why-join" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("why-join")}
        >
          Why Join Page
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "join-step" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("join-step")}
        >
          Join Step
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "faq" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("faq")}
        >
          FAQ
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "our-members" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("our-members")}
        >
          Our Members
        </span>
      </div>

      {options === "why-join" ? <WhyJoin /> : null}
      {options === "join-step" ? <JoinStep /> : null}
      {options === "faq" ? <FAQS /> : null}
      {options === "our-members" ? <OurMembers /> : null}
    </>
  );
};

export default MembershipPage;
