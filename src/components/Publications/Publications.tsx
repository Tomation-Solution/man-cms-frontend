import React, { useState } from "react";
import Button from "../Button/Button";
import CreatePublicationsModal from "../Modals/PublicationModal/CreatePublicationsModal";
import OffCanvas from "../OffCanvas/OffCanvas";
import SearchBanner from "../SearchBanner/SearchBanner";
import PublicationTables from "../Tables/PublicationTables/PublicationTables";
import { useMediaQuery } from "react-responsive";

const Publications = () => {
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
        <CreatePublicationsModal />
      </OffCanvas>
      {/* <PublicationsContainer>
        <SearchBanner />
      </PublicationsContainer> */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button styleType={"sec"} onClick={() => setIsOpen(!isOpen)}>
          Create New
        </Button>
      </div>
      <PublicationTables />
    </>
  );
};

export default Publications;
