import React, { useState } from "react";
import WhyJoin from "../components/Membership/WhyJoin";

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
      </div>

      {options === "why-join" ? <WhyJoin /> : null}
    </>
  );
};

export default MembershipPage;
