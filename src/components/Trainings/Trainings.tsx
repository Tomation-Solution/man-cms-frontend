import React, { useState } from "react";
import Button from "../Button/Button";
import OffCanvas from "../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import CreateTrainings from "../Modals/TrainingsModal/CreateTrainings";
import TrainingTable from "../Tables/TrainingsTables/TrainingTable";
import TrainingsUpdateBanner from "../Modals/TrainingsModal/updateBannerModal";

const Trainings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPastTrainings, setIsPastTrainings] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  return (
    <>
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        <CreateTrainings closefn={() => setIsOpen(!isOpen)} />
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsBannerOpen}
        isOpen={isBannerOpen}
      >
        <TrainingsUpdateBanner closefn={() => setIsBannerOpen(!isBannerOpen)} />
      </OffCanvas>

      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <Button styleType={"sec"} onClick={() => setIsOpen(true)}>
            Create New
          </Button>

          <Button styleType={"sec"} onClick={() => setIsBannerOpen(true)}>
            Update Banner
          </Button>
        </div>
        <Button
          styleType={"sec"}
          onClick={() => setIsPastTrainings(!isPastTrainings)}
        >
          {isPastTrainings ? "View Upcoming Trainings" : "View Past Trainings"}
        </Button>
      </div>
      <TrainingTable isPastTrainings={isPastTrainings} />
    </>
  );
};

export default Trainings;
