import React, { useState } from "react";
import Button from "../Button/Button";
import OffCanvas from "../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import CreateEventModal from "../Modals/EventsModal/CreateEventModal";
import EventsTable from "../Tables/EventsTables/EventsTable";

const Events = () => {
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
        <CreateEventModal closefn={() => setIsOpen(!isOpen)} />
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
      <EventsTable />
    </>
  );
};

export default Events;
