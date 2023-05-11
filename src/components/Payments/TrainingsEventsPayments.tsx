import React from "react";
import { useQuery } from "react-query";
import { eventTrainingPaymentRegistration } from "../../axios/api-calls";
import { ContactMainContainer } from "../Modals/Modals.styles";
import Loading from "../Loading/Loading";
import { FormError } from "../../globals/styles/forms.styles";
import TrainingsEventsPaymentItem, {
  TrainingsEventPaymentType,
} from "./PaymentsItems/TrainingsEventsPaymentItem";

const TrainingsEventsPayments = () => {
  const { isLoading, isError, isFetching, data } = useQuery(
    "all-events-registrations",
    eventTrainingPaymentRegistration,
    {
      select: (data) => data.data,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <ContactMainContainer>
        <Loading loading={isLoading || isFetching} />
        {!isError && data ? (
          <>
            {data.map((item: TrainingsEventPaymentType, index: number) => (
              <TrainingsEventsPaymentItem data={item} key={index} />
            ))}
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
