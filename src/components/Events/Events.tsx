import React, { useState } from "react";
import Button from "../Button/Button";
import OffCanvas from "../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import CreateEventModal from "../Modals/EventsModal/CreateEventModal";
import EventsTable from "../Tables/EventsTables/EventsTable";
import EventUpdateBanner from "../Modals/EventsModal/UpdateBannerModal";

const Events = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPastEvents, setIsPastEvents] = useState(false);
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
        <CreateEventModal closefn={() => setIsOpen(!isOpen)} />
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsBannerOpen}
        isOpen={isBannerOpen}
      >
        <EventUpdateBanner closefn={() => setIsBannerOpen(!isBannerOpen)} />
      </OffCanvas>

      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <Button styleType={"sec"} onClick={() => setIsOpen(true)}>
            Create New
          </Button>

          <Button styleType={"sec"} onClick={() => setIsBannerOpen(true)}>
            Update Banner
          </Button>
        </div>
        <Button
          styleType={"sec"}
          onClick={() => setIsPastEvents(!isPastEvents)}
        >
          {isPastEvents ? "View Upcoming Events" : "View Past Events"}
        </Button>
      </div>
      <EventsTable isPastEvents={isPastEvents} />
    </>
  );
};

export default Events;
