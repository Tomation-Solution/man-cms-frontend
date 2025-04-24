import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import OffCanvas from "../components/OffCanvas/OffCanvas";
import Button from "../components/Button/Button";

type Props = {
  btnName?: string;
  createModalComponent: any;
  tableComponent: any;
  id?: string;
};

function CreateDrawer({
  createModalComponent: CreateModalComponent,
  tableComponent: TableComponent,
  btnName = "Create New",
  id,
}: Props) {
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
        <CreateModalComponent closefn={() => setIsOpen(!isOpen)} id={id} />
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
          {btnName}
        </Button>
      </div>

      <TableComponent id={id} />
    </>
  );
}

export default CreateDrawer;
