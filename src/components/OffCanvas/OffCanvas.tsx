import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { seqBlue100, seqWhite } from "../../globals/colors";

type Prop = React.PropsWithChildren<{
  //   btnContrroller:React.ReactElement;
  size?: number;
  direction?: "left" | "right" | "bottom" | "top";
  btnClick?: () => void;
  isOpen: boolean;
  setIsOpen: any;
}>;

const OffCanvas = ({
  children,
  isOpen,
  setIsOpen,
  size = 100,
  direction = "right",
  btnClick = () => null,
}: Prop): React.ReactElement => {
  const toggleDrawer = () => {
    btnClick();
    setIsOpen((prevState: boolean) => !prevState);
  };
  return (
    <Drawer
      open={isOpen}
      onClose={toggleDrawer}
      className="bla bla bla"
      size={`${size}%`}
      direction={direction}
      zIndex={4000}
      style={{
        overflow: "scroll",
        backgroundColor: `${seqBlue100}`,
        color: `${seqWhite}`,
        padding: "1rem",
      }}
      // style={{'zIndex':'1000'}}
    >
      <div
        style={{
          padding: ".8rem .3rem",
          paddingTop: ".8rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <AiOutlineCloseCircle onClick={(e) => setIsOpen(false)} />
      </div>
      {children}
    </Drawer>
  );
};

export default OffCanvas;
