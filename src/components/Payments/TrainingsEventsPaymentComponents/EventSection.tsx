import React from "react";
import TrainingsEventsPaymentItem from "../PaymentsItems/TrainingsEventsPaymentItem";

const EventSection: React.FC<{ data: any[] }> = ({ data }) => {
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
