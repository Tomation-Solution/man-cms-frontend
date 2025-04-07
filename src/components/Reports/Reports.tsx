import React, { useState } from "react";
import Button from "../Button/Button";
import OffCanvas from "../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import CreateReportModal from "../Modals/ReportsModal/NewCreateReportModal";
import ReportTable from "../Tables/ReportTables/ReportTable";

const Reports = () => {
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
        <CreateReportModal closefn={() => setIsOpen(!isOpen)} />
      </OffCanvas>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button styleType={"sec"} onClick={() => setIsOpen(true)}>
          Create Report
        </Button>
      </div>
      <ReportTable />
    </>
  );
};

export default Reports;
