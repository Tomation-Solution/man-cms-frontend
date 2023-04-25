import React, { useState } from "react";
import Button from "../Button/Button";
import OffCanvas from "../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import CreateOffice from "../Modals/OperateOffice/CreateOffice";
import OfficeTable from "../Tables/OperateTables/OfficeTable";
const Office = () => {
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
        <CreateOffice closefn={() => setIsOpen(!isOpen)} />
      </OffCanvas>
      {/* <PublicationsContainer>
      <SearchBanner />
    </PublicationsContainer> */}
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
      <OfficeTable />
    </>
  );
};

export default Office;
