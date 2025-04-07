import { useEffect, useState } from "react";
import Button from "../../Button/Button";
import Modal from "./Modal";

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  item,
  onClose,
  onDelete,
  onArchive,
}: any) => {
  const [disabled, setDisabled] = useState(true);
  const [confirmationText, setConfirmationText] = useState("");

  useEffect(() => {
    const tempDisabled =
      confirmationText.toLowerCase().trim() !== "I understand".toLowerCase();
    setDisabled(tempDisabled);
  }, [confirmationText]);

  return (
    <Modal onClose={onClose}>
      <h3
        style={{
          display: "flex",
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: "1.5rem",
          fontWeight: 700,
        }}
      >
        Confirm Delete Action
      </h3>
      <p style={{ textAlign: "center" }}>
        Deleting this item is permanent, you will not be able to recover the
        data. <br />
        Type "<span style={{ fontWeight: 600 }}>I understand</span>" to
        continue.
      </p>
      <input
        type="text"
        value={confirmationText}
        onChange={(e) => setConfirmationText(e.target.value)}
        placeholder="Type 'I understand'"
        style={{
          border: "0rem solid transparent",
          outline: "none",
          padding: "1rem",
          backgroundColor: "rgba(206, 206, 206, 0.3)",
          borderRadius: "10px",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexDirection: "row-reverse",
        }}
      >
        <Button styleType="sec" onClick={onArchive}>
          Archive Instead
        </Button>
        <Button
          style={{
            paddingRight: "1.5rem",
            paddingLeft: "1.5rem",
            opacity: disabled ? "0.5" : "1",
          }}
          styleType="pry"
          disabled={disabled}
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
