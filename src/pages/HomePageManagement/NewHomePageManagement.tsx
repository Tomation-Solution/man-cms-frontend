import { useAuthStore } from "../../zustand/store";
import { Navigate } from "react-router-dom";
import AdvertSection from "../../components/AdvertSection/AdvertSection";
import HomePageSlider from "../../components/HomePageSlider/NewHomePageSlider";
import { useState } from "react";
import WhyWeAreUnique from "./_components/WhyWeAreUnique";
import HomePageContent from "./_components/HomePageContent";

const HomePageManagement = () => {
  const [options, setOptions] = useState<string>("WhyWeareUnique");
  const userData = useAuthStore.getState().user;

  if (!["super_user", "public_view"].includes(String(userData?.user_type))) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div>
      <div
        style={{
          padding: "10px 5px",
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          margin: "20px 0",
          // width: "100%",
        }}
      >
        <span
          style={{
            fontWeight: "500",
            color: `${options === "WhyWeareUnique" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("WhyWeareUnique")}
        >
          Why We are Unique
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "HomePageContent" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("HomePageContent")}
        >
          HomePage Content
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "Advertisements" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("Advertisements")}
        >
          Advertisements
        </span>
        <span
          style={{
            fontWeight: "500",
            color: `${options === "Slider" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("Slider")}
        >
          Home Page Slider
        </span>
      </div>

      {options === "WhyWeareUnique" && <WhyWeAreUnique />}
      {options === "HomePageContent" && <HomePageContent />}
      {options === "Advertisements" && <AdvertSection />}
      {options === "Slider" && <HomePageSlider />}
    </div>
  );
};

export default HomePageManagement;
