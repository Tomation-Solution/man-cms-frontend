import React, { InputHTMLAttributes, useState } from "react";

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  maxHeight: "90vh",
  overflowY: "auto",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "bold",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  marginBottom: "15px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const filterButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#2b3513",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const applyButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#2b3513",
  color: "#fff",
};

const cancelButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#ccc",
};

export default function DownloadModal({
  isOpen,
  onClose,
  onApply,
}: {
  onApply: (filters: any) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [filters, setFilters] = useState({
    format: "pdf",
    payment_method: "",
    status: "",
    start_date: "",
    end_date: "",
  });

  const handleChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: "15px" }}>Download Settings</h3>

            <label style={labelStyle}>Payment Method</label>
            <select
              style={inputStyle}
              name="payment_method"
              value={filters.payment_method}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="paystack">Paystack</option>
              <option value="flutterwave">Flutterwave</option>
              <option value="remita">Remita</option>
              <option value="interswitch">Interswitch</option>
            </select>

            <label style={labelStyle}>Status</label>
            <select
              style={inputStyle}
              name="status"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>

            <label style={labelStyle}>Format</label>
            <select
              style={inputStyle}
              name="format"
              value={filters.format}
              onChange={handleChange}
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>

            <label style={labelStyle}>Start Date</label>
            <input
              style={inputStyle}
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleChange}
            />

            <label style={labelStyle}>End Date</label>
            <input
              style={inputStyle}
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleChange}
            />

            <div style={buttonGroupStyle}>
              <button onClick={handleApply} style={applyButtonStyle}>
                Download
              </button>
              <button onClick={onClose} style={cancelButtonStyle}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
