import React, { useState } from "react";
import Button from "../Button/Button";
import CreateNewsModal from "../Modals/NewsModal/CreateNewsModal";
import OffCanvas from "../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import NewsTable from "../Tables/NewsTables/NewsTable";

const News = () => {
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
        <CreateNewsModal closefn={() => setIsOpen(!isOpen)} />
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
      <NewsTable />
    </>
  );
};

export default News;
