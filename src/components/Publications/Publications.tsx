import React, { useState } from "react";
import Button from "../Button/Button";
import CreatePublicationsModal from "../Modals/PublicationModal/CreatePublicationsModal";
import OffCanvas from "../OffCanvas/OffCanvas";
import PublicationTables from "../Tables/PublicationTables/PublicationTables";
import { useMediaQuery } from "react-responsive";
import { PublicationsHeadBanner } from "./Publications.styles";
import EditPublicationTypes from "../Modals/PublicationModal/EditPublicationTypes";

const Publications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditPublication, setShowEditPublication] = useState(false);
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });
  return (
    <>
      {showEditPublication && (
        <EditPublicationTypes
          closefn={() => setShowEditPublication(!showEditPublication)}
        />
      )}
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        <CreatePublicationsModal />
      </OffCanvas>

      <PublicationsHeadBanner>
        <Button onClick={() => setShowEditPublication(!showEditPublication)}>
          Publication types
        </Button>
        <Button styleType={"sec"} onClick={() => setIsOpen(!isOpen)}>
          Create new publication
        </Button>
      </PublicationsHeadBanner>

      <PublicationTables />
    </>
  );
};

export default Publications;
