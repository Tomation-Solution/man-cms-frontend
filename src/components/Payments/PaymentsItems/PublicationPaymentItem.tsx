import React from "react";
import { datefromatter } from "../../../utils/DateFormatter";
import { formatMoney } from "../../../utils/moneyFormatter";

export type PublicationsPaymentType = {
  id: number;
  publication: number;
  payment: {
    payment_ref: string;
    amount: string;
    payment_method: string | null;
    access_code: string;
    status: string;
  };
  fullname: string;
  email: string;
  phone_number: string;
  company_name: string;
  amount_to_pay: string;
  is_verified: boolean;
  file_received: boolean;
  created_at: string;
};

const PublicationPaymentItem: React.FC<{ data: PublicationsPaymentType }> = ({
  data,
}) => {
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      padding: "20px",
      marginBottom: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "10px",
    },
    infoList: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    },
    infoItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.5rem 0",
    },
    label: {
      fontWeight: "bold",
      color: "#555",
    },
    value: {
      color: "#333",
    },
    verified: {
      color: "green",
    },
    notVerified: {
      color: "red",
    },
    received: {
      color: "blue",
    },
    notReceived: {
      color: "orange",
    },
  };

  console.log("PublicationPaymentItem data:", data);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{data.company_name}</h1>
      <div style={styles.infoList}>
        <div style={styles.infoItem}>
          <span style={styles.label}>Reference Number: </span>
          <span style={styles.value}>{data.payment.payment_ref}</span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.label}>Publication ID: </span>
          <span style={styles.value}>{data.publication}</span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.label}>Email: </span>
          <span style={styles.value}>{data.email}</span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.label}>Full Name: </span>
          <span style={styles.value}>{data.fullname}</span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.label}>Phone Number: </span>
          <span style={styles.value}>{data.phone_number}</span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.label}>Payment Method: </span>
          <span style={styles.value}>
            {data.payment.payment_method || "N/A"}
          </span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.label}>Amount: </span>
          <span style={styles.value}>{formatMoney(data.amount_to_pay)}</span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.label}>Verification Status: </span>
          <span
            style={{
              ...styles.value,
              ...(data.is_verified ? styles.verified : styles.notVerified),
            }}
          >
            {data.is_verified ? "Confirmed" : "Not Confirmed"}
          </span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.label}>File Delivery Status: </span>
          <span
            style={{
              ...styles.value,
              ...(data.file_received ? styles.received : styles.notReceived),
            }}
          >
            {data.file_received ? "Received" : "Not Received"}
          </span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.label}>Payment Date: </span>
          <span style={styles.value}>
            {datefromatter(new Date(data.created_at))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PublicationPaymentItem;
