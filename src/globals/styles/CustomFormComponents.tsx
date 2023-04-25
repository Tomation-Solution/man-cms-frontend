import { FC, ReactNode } from "react";
import { FormButton } from "./forms.styles";
import { AiOutlinePlusCircle } from "react-icons/ai";

export const CustomModalButton: FC<{
  children: ReactNode;
  isDisabled?: boolean;
  clickfn?: () => void;
}> = ({ children, isDisabled, clickfn }) => (
  <FormButton
    disabled={isDisabled}
    onClick={clickfn}
    style={{
      backgroundColor: "white",
      color: "#000",
      padding: "10px 20px",
      fontWeight: "700",
    }}
  >
    {children}
  </FormButton>
);

export const AddMoreButton: FC<{
  children: ReactNode;
  justify?: string;
  click?: () => void;
}> = ({ click, children, justify }) => (
  <div style={{ display: "flex", justifyContent: `${justify}` }}>
    <div
      onClick={click}
      style={{
        margin: "20px 0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <AiOutlinePlusCircle />
      <p>{children}</p>
    </div>
  </div>
);

export const SelectImage: FC<{ image?: string }> = ({ image }) => (
  <div style={{ margin: "10px 0px" }}>
    <h4>Current Image</h4>
    <img
      alt=""
      src={image}
      style={{ width: "100%", height: "100px", objectFit: "contain" }}
    />
  </div>
);
