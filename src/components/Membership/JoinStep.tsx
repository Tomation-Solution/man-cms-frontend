import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import OffCanvas from "../OffCanvas/OffCanvas";
import Button from "../Button/Button";
import JoinStepCreate from "../Modals/JoinStep/JoinStepCreate";
import JoinStepTable from "../Tables/Membership/JoinStepTable";

const JoinStep = () => {
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
        <JoinStepCreate closefn={() => setIsOpen(!isOpen)} />
      </OffCanvas>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Button styleType={"sec"} onClick={() => setIsOpen(!isOpen)}>
          Create New
        </Button>
      </div>
      <JoinStepTable />
    </>
  );
};

export default JoinStep;
