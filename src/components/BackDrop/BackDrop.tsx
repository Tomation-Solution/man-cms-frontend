import React, { FC, ReactNode } from "react";
import { BackDropCon } from "./BackDrop.styles";

type Props = {
  children: ReactNode;
};

const BackDrop: FC<Props> = ({ children }) => {
  return <BackDropCon>{children}</BackDropCon>;
};

export default BackDrop;
