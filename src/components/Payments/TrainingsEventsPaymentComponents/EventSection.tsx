import React from "react";
import TrainingsEventsPaymentItem, {
  TrainingsEventPaymentType,
} from "../PaymentsItems/TrainingsEventsPaymentItem";

const EventSection: React.FC<{ data: TrainingsEventPaymentType[] }> = ({
  data,
}) => {
  return (
    <>
      {data
        ? data.map((item, index: number) => (
            <TrainingsEventsPaymentItem data={item} key={index} />
          ))
        : null}
    </>
  );
};

export default EventSection;
