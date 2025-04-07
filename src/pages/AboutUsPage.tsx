import React, { useState } from "react";
import History from "../components/AboutUs/history/History";
import Advocacy from "../components/AboutUs/Advocacy";
import Affilliates from "../components/AboutUs/Affilliates";
import HowWeWork from "../components/AboutUs/HowWeWork";
import HowWeOperate from "../components/AboutUs/HowWeOperate";
import Office from "../components/AboutUs/Office";
import Branch from "../components/AboutUs/Branch";
import Contacts from "../components/AboutUs/Contacts";
import OurExcutive from "../components/AboutUs/OurExcutive";
import { useAuthStore } from "../zustand/store";
import { Navigate } from "react-router-dom";

const AboutUsPage = () => {
  const [options, setOptions] = useState("history");
  const userData = useAuthStore.getState().user;

  if (!["super_user", "public_view"].includes(String(userData?.user_type))) {
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
          // width: "100%",
        }}
      >
        <span
          style={{
            fontWeight: "500",
            color: `${options === "history" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("history")}
        >
          History Page
        </span>
        <span
          style={{
            fontWeight: "500",
            color: `${options === "advocacy" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("advocacy")}
        >
          Advocacy Page
        </span>
        <span
          style={{
            fontWeight: "500",
            color: `${options === "affilliates" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("affilliates")}
        >
          Affilliates Page
        </span>
        <span
          style={{
            fontWeight: "500",
            color: `${options === "how-we-work" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("how-we-work")}
        >
          How We Work Page
        </span>
        <span
          style={{
            fontWeight: "500",
            color: `${options === "how-we-operate" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("how-we-operate")}
        >
          Where We Work Page
        </span>
        <span
          style={{
            fontWeight: "500",
            color: `${options === "operate-office" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            width: "200px",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("operate-office")}
        >
          Operation Offices
        </span>
        <span
          style={{
            fontWeight: "500",
            color: `${options === "operate-branch" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            width: "200px",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("operate-branch")}
        >
          Operation Branch
        </span>
        <span
          style={{
            fontWeight: "500",
            color: `${options === "contacts" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            width: "200px",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("contacts")}
        >
          Contacts
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "Executives" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            width: "200px",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("Executives")}
        >
          Executives
        </span>
      </div>

      {options === "history" ? <History /> : null}
      {options === "advocacy" ? <Advocacy /> : null}
      {options === "affilliates" ? <Affilliates /> : null}
      {options === "how-we-work" ? <HowWeWork /> : null}
      {options === "how-we-operate" ? <HowWeOperate /> : null}
      {options === "operate-office" ? <Office /> : null}
      {options === "operate-branch" ? <Branch /> : null}
      {options === "contacts" ? <Contacts /> : null}
      {options === "Executives" ? <OurExcutive /> : null}
    </>
  );
};

export default AboutUsPage;
