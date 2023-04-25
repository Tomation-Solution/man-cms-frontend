import React from "react";
import { RotateLoader } from "react-spinners";
import { seqBlue100 } from "../../globals/colors";
import BackDrop from "../BackDrop/BackDrop";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: `${seqBlue100}`,
};

const Loading: React.FC<{ loading: boolean; light?: boolean }> = ({
  light,
  loading,
}) => {
  return (
    <>
      {loading && (
        <BackDrop>
          <RotateLoader
            color={light ? "#fff" : seqBlue100}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </BackDrop>
      )}
    </>
  );
};

export default Loading;
