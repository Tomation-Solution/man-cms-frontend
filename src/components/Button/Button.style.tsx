import styled from "styled-components";

import { ButtonProp } from "./Button";
import { createExternalStyle } from "../../utils/extraFunction";
import { seqBlue100, seqWhite } from "../../globals/colors";
import { motion } from "framer-motion";

export const ButtonStyle = styled(motion.button)<ButtonProp>`
  border: transparent;
  padding: ${(prop) => (prop.isSmall ? "0.4rem 0.6rem" : "0.7rem 1rem")};
  border-radius: 10px;
  cursor: pointer;
  /* this code makes the icon if there is one to fit with the button word */
  display: flex;
  align-items: center;
  justify-content: space-between;
  justify-content: center;

  ${(prop) => {
    let style;
    if (prop.styleType === "pry") {
      style = `background-color:${seqBlue100};color: ${seqWhite};font-weight: 600;`;
    } else if (prop.styleType === "sec") {
      style = `background-color:transparent;color: ${seqBlue100};font-weight: 600;border:1px solid  ${seqBlue100};`;
    } else if (prop.styleType === "whiteBg") {
      style = `background-color: ${seqWhite};color: ${seqBlue100};font-weight: 600;`;
    }
    return style;
  }};
  ${(props) => createExternalStyle(props)}
`;
