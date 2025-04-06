import React from "react";

export default function Modal({
  onClose,
  children,
}: {
  onClose: any;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={() => onClose()}
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        position: "fixed",
        top: "0",
        left: "0",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          display: "flex",
          marginTop: "auto",
          marginBottom: "auto",
          backgroundColor: "white",
          maxWidth: "40rem",
          padding: "2rem",
          borderRadius: "10px",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}
