import React, { useState } from "react";
import Button from "../Button/Button";
import OffCanvas from "../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import CreateBranch from "../Modals/OperateBranch/CreateBranch";
import BranchTable from "../Tables/OperateTables/BranchTable";

const Branch = () => {
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
        <CreateBranch closefn={() => setIsOpen(!isOpen)} />
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
      <BranchTable />
    </>
  );
};

export default Branch;
