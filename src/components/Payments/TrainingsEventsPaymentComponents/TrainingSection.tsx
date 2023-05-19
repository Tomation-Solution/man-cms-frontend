import React from "react";
import TrainingsEventsPaymentItem, {
  TrainingsEventPaymentType,
} from "../PaymentsItems/TrainingsEventsPaymentItem";

const TrainingSection: React.FC<{
  data: TrainingsEventPaymentType[];
  trainingData: any;
  trainingTypeFilter: "mrc" | "mpdcl" | "others";
}> = ({ data, trainingData, trainingTypeFilter }) => {
  if (trainingTypeFilter === "others") {
    return (
      <>
        {data
          .filter((item) => {
            const trainingId = item.training;
            const trainingType = trainingData
              .find((item: any) => item.id === trainingId)
              .training_type.toLowerCase();
            if (!["mrc", "mpdcl"].includes(trainingType)) {
              return true;
            }
          })
          .map((item, index: number) => {
            return <TrainingsEventsPaymentItem data={item} key={index} />;
          })}
      </>
    );
  }
  return (
    <>
      {data
        .filter((item) => {
          const trainingId = item.training;
          const trainingType = trainingData
            .find((item: any) => item.id === trainingId)
            .training_type.toLowerCase();
          if (trainingType === trainingTypeFilter) {
            return true;
          }
        })
        .map((item, index: number) => {
          return <TrainingsEventsPaymentItem data={item} key={index} />;
        })}
    </>
  );
};

export default TrainingSection;
