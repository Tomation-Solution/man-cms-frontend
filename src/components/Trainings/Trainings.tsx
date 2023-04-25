import React, { useState } from "react";
import Button from "../Button/Button";
import OffCanvas from "../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import CreateTrainings from "../Modals/TrainingsModal/CreateTrainings";
import TrainingTable from "../Tables/TrainingsTables/TrainingTable";

const Trainings = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button styleType={"sec"} onClick={() => setIsOpen(true)}>
          Create New
        </Button>
      </div>
      <TrainingTable />
    </>
  );
};

export default Trainings;
