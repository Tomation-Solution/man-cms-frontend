import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import OffCanvas from "../OffCanvas/OffCanvas";
import Button from "../Button/Button";
import JoinStepCreate from "../Modals/JoinStep/JoinStepCreate";
import JoinStepTable from "../Tables/Membership/JoinStepTable";
import JoinStepUpdateBanner from "../Modals/JoinStep/JoinStepUpdatebanner";

const JoinStep = () => {
  const [isOpen, setIsOpen] = useState(false);
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
        <JoinStepCreate closefn={() => setIsOpen(!isOpen)} />
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsBannerOpen}
        isOpen={isBannerOpen}
      >
        <JoinStepUpdateBanner closefn={() => setIsBannerOpen(!isBannerOpen)} />
      </OffCanvas>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
          gap: "15px",
        }}
      >
        <Button styleType={"sec"} onClick={() => setIsOpen(!isOpen)}>
          Create New
        </Button>
        <Button
          styleType={"sec"}
          onClick={() => setIsBannerOpen(!isBannerOpen)}
        >
          Update Banner
        </Button>
      </div>
      <JoinStepTable />
    </>
  );
};

export default JoinStep;
