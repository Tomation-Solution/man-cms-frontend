import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Button from "../Button/Button";
import OffCanvas from "../OffCanvas/OffCanvas";
import OurMembersCreate from "../Modals/OurMembers/OurMembersCreate";
import OurMembersTable from "../Tables/Membership/OurMembersTable";

const OurMembers = () => {
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
        <OurMembersCreate closefn={() => setIsOpen(!isOpen)} />
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
      <OurMembersTable />
    </>
  );
};

export default OurMembers;
