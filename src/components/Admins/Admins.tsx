import React, { useState } from "react";
import Button from "../Button/Button";
import OffCanvas from "../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import CreateAdminModal from "../Modals/AdminModals/CreateAdminModal";
import AdminTable from "../Tables/Admin/AdminTable";

const Admins = () => {
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
        <CreateAdminModal closefn={() => setIsOpen(false)} />
      </OffCanvas>

      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Button styleType="sec" onClick={() => setIsOpen(true)}>
          Create Admin
        </Button>
      </div>

      <AdminTable />
    </>
  );
};

export default Admins;
