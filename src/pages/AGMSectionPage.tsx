import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuthStore } from "../zustand/store";
import { useEffect, useState } from "react";
import AGMHomepage from "../components/AGMSection/AGMHomepage";
import AGMProgramme from "../components/AGMSection/AGMProgramme";
import AGMProgram from "../components/AGMSection/AGMProgram";
import AGMSpeakers from "../components/AGMSection/AGMSpeakers";
import AGMExhibitionImage from "../components/AGMSection/AGMExhibitionImage";
import AGMVenue from "../components/AGMSection/AGMVenue";
import AGMExhibitionpage from "../components/AGMSection/AGMExhibitionpage";
import AGMFaq from "../components/AGMSection/AGMFaq";
import AGMPastEvents from "../components/AGMSection/AGMPastEvents";
import { useQuery } from "react-query";
import { getCurrentAgmEvent } from "../axios/api-calls";

type OptionsType =
  | "home"
  | "programme"
  | "program"
  | "speakers"
  | "venue"
  | "exhibition"
  | "exhibition-image"
  | "faq"
  | "past-agm-events";

function AGMSectionPage() {
  const userData = useAuthStore.getState().user;
  const { id } = useParams();
  const currentAGMEvent = useQuery("current-agm-event", getCurrentAgmEvent, {
    select(data) {
      return data?.results?.[0];
    },
  });
  console.log(currentAGMEvent);

  useEffect(() => {
    if (!id) {
    }
  });

  const [options, setOptions] = useState<OptionsType>("home");

  const navigation_values: {
    title: string;
    value: OptionsType;
  }[] = [
    { title: "Home Page", value: "home" },
    { title: "Programme Page", value: "programme" },
    { title: "Programs", value: "program" },
    { title: "Speakers Page", value: "speakers" },
    { title: "Venue", value: "venue" },
    { title: "Exhibition Page", value: "exhibition" },
    { title: "Exhibition Images", value: "exhibition-image" },
    { title: "FAQs Page", value: "faq" },
    { title: "Past AGM Events", value: "past-agm-events" },
  ];

  if (!["super_user", "event_training"].includes(String(userData?.user_type))) {
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
        {navigation_values.map((item, index) => (
          <span
            key={index}
            style={{
              fontWeight: "500",
              color: `${options === item.value ? "#4FDE9D" : "#2b3513"}`,
              cursor: "pointer",
              borderRight: "1px solid #2b3513",
              flex: "0 0 160px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setOptions(item.value)}
          >
            {item.title}
          </span>
        ))}
      </div>

      {options === "home" ? (
        <AGMHomepage id={id || currentAGMEvent?.data?.id} />
      ) : null}
      {options === "programme" ? (
        <AGMProgramme id={id || currentAGMEvent?.data?.id} />
      ) : null}
      {options === "program" ? (
        <AGMProgram id={id || currentAGMEvent?.data?.id} />
      ) : null}
      {options === "speakers" ? (
        <AGMSpeakers id={id || currentAGMEvent?.data?.id} />
      ) : null}
      {options === "exhibition-image" ? (
        <AGMExhibitionImage id={id || currentAGMEvent?.data?.id} />
      ) : null}
      {options === "exhibition" ? (
        <AGMExhibitionpage id={id || currentAGMEvent?.data?.id} />
      ) : null}
      {options === "venue" ? (
        <AGMVenue id={id || currentAGMEvent?.data?.id} />
      ) : null}
      {options === "faq" ? (
        <AGMFaq id={id || currentAGMEvent?.data?.id} />
      ) : null}
      {options === "past-agm-events" ? <AGMPastEvents /> : null}
    </>
  );
}

export default AGMSectionPage;
