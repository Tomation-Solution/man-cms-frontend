import React from "react";

const RegistrationCard = ({ data }: any) => {
  const {
    fullname,
    email,
    phone_number,
    company_name,
    event_type,
    event,
    training,
    amount_to_pay,
    is_verified,
    payment,
  } = data;

  const isTraining = event_type === "TRAINING";
  const item = isTraining ? training : event;

  const cardStyle = {
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "16px",
    border: "1px solid #e5e7eb",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  };

  const nameStyle = {
    fontSize: "18px",
    fontWeight: "600",
  };

  const statusStyle = {
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "9999px",
    backgroundColor: is_verified ? "#D1F7D1" : "#FEE2E2",
    color: is_verified ? "#32C48D" : "#F44336",
  };

  const textStyle = {
    fontSize: "14px",
    color: "#4B5563",
  };

  const sectionTitleStyle = {
    fontSize: "16px",
    fontWeight: "500",
    color: "#1D4ED8",
    marginBottom: "4px",
  };

  const paymentInfoStyle = {
    fontSize: "14px",
    color: "#F87171",
    fontWeight: "600",
    marginTop: "8px",
  };

  const priceStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#4B5563",
  };

  const borderTopStyle = {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "8px",
    marginTop: "8px",
  };

  const verifiedText = is_verified ? "Verified" : "Not Verified";
  const formattedAmount = `₦${parseFloat(amount_to_pay).toLocaleString()}`;
  const formattedPrice = item?.is_paid
    ? `₦${parseFloat(item?.price).toLocaleString()}`
    : null;

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h2 style={nameStyle}>{fullname}</h2>
        <span style={statusStyle}>{verifiedText}</span>
      </div>

      <p style={textStyle}>
        {email} | {phone_number}
      </p>
      <p style={textStyle}>Company: {company_name}</p>

      <div style={borderTopStyle}>
        <h3 style={sectionTitleStyle}>
          {isTraining ? "Training" : "Event"}: {item?.name}
        </h3>
        <p style={textStyle}>{item?.location}</p>
        <p style={textStyle}>
          {item?.start_date} to {item?.end_date}
        </p>
        {formattedPrice && (
          <p style={paymentInfoStyle}>Price: {formattedPrice}</p>
        )}
      </div>

      <div style={borderTopStyle}>
        <p style={priceStyle}>
          Amount to Pay: <strong>{formattedAmount}</strong>
        </p>

        {payment && Number(amount_to_pay) > 0 && (
          <div style={{ marginTop: "8px", fontSize: "14px", color: "#10B981" }}>
            Payment Status: <strong>{payment.status}</strong>
            <br />
            Method: {payment.payment_method}
            <br />
            Ref: {payment.payment_ref}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationCard;
