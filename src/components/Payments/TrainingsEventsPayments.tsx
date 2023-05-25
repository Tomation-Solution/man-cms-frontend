import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  eventTrainingPaymentRegistration,
  trainingsGetAll,
} from "../../axios/api-calls";
import { ContactMainContainer } from "../Modals/Modals.styles";
import Loading from "../Loading/Loading";
import { FormError } from "../../globals/styles/forms.styles";
import { TrainingsEventPaymentType } from "./PaymentsItems/TrainingsEventsPaymentItem";
import EventSection from "./TrainingsEventsPaymentComponents/EventSection";
import TrainingSection from "./TrainingsEventsPaymentComponents/TrainingSection";

const TrainingsEventsPayments = () => {
  const [options, setOptions] = useState("event");

  const { isLoading, isError, isFetching, data } = useQuery(
    "all-events-registrations",
    eventTrainingPaymentRegistration,
    {
      select: (data) => data.data,
      refetchOnWindowFocus: false,
    }
  );

  const trainingQueryResult = useQuery("all-trainings", trainingsGetAll, {
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });

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
            color: `${options === "event" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 200px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("event")}
        >
          events
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "mrc-training" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 200px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("mrc-training")}
        >
          mrc training
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "mpdcl-training" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 200px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("mpdcl-training")}
        >
          mpdcl training
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "other-training" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 200px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("other-training")}
        >
          other training
        </span>
      </div>
      <ContactMainContainer>
        <Loading
          loading={
            isLoading ||
            isFetching ||
            trainingQueryResult.isLoading ||
            trainingQueryResult.isFetching
          }
        />
        {(!isError || !trainingQueryResult.isError) &&
        (data || trainingQueryResult.data) ? (
          <>
            {options === "event" ? (
              <EventSection
                data={data?.filter(
                  (item: TrainingsEventPaymentType) => item.type === "EVENT"
                )}
              />
            ) : null}

            {options === "mrc-training" ? (
              <TrainingSection
                data={data?.filter(
                  (item: TrainingsEventPaymentType) => item.type === "TRAINING"
                )}
                trainingData={trainingQueryResult.data}
                trainingTypeFilter={"mrc"}
              />
            ) : null}

            {options === "mpdcl-training" ? (
              <TrainingSection
                data={data?.filter(
                  (item: TrainingsEventPaymentType) => item.type === "TRAINING"
                )}
                trainingData={trainingQueryResult.data}
                trainingTypeFilter={"mpdcl"}
              />
            ) : null}

            {options === "others" ? (
              <TrainingSection
                data={data?.filter(
                  (item: TrainingsEventPaymentType) => item.type === "TRAINING"
                )}
                trainingData={trainingQueryResult.data}
                trainingTypeFilter={"others"}
              />
            ) : null}
          </>
        ) : (
          <FormError>
            Can't Fetch Trainings & Events Registrations Data
          </FormError>
        )}
      </ContactMainContainer>
    </>
  );
};

export default TrainingsEventsPayments;
