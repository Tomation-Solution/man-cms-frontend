import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Button from "../Button/Button";
import OffCanvas from "../OffCanvas/OffCanvas";
import FAQSCreate from "../Modals/FAQS/FAQSCreate";
import FAQTable from "../Tables/Membership/FAQTable";

const FAQS = () => {
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
        <FAQSCreate closefn={() => setIsOpen(!isOpen)} />
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
      <FAQTable />
    </>
  );
};

export default FAQS;
