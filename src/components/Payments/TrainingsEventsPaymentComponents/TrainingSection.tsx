import React from "react";
import RegistrationCard from "../PaymentsItems/TrainingsEventsPaymentItem";

const TrainingSection: React.FC<{
  data: any[];
  trainingTypeFilter: "mrc" | "mpdcl" | "others";
}> = ({ data, trainingTypeFilter }) => {
  return (
    <>
      {data?.length > 0
        ? data.map((item, index: number) => {
            return <RegistrationCard data={item} key={index} />;
          })
        : null}
    </>
  );
};

export default TrainingSection;
