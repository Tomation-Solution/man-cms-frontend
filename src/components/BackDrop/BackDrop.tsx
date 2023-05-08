import React, { FC, ReactNode } from "react";
import { BackDropCon } from "./BackDrop.styles";

type Props = {
  children: ReactNode;
  overlay?: boolean;
};

const BackDrop: FC<Props> = ({ children, overlay = false }) => {
  return <BackDropCon isOverlay={overlay}>{children}</BackDropCon>;
};

export default BackDrop;
