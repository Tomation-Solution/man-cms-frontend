import React from "react";
import Reports from "../components/Reports/Reports";
import { useAuthStore } from "../zustand/store";
import { Navigate } from "react-router-dom";

const ReportsPage = () => {
  const userData = useAuthStore.getState().user;

  if (
    !["super_user", "publication_news"].includes(String(userData?.user_type))
  ) {
    return <Navigate to="/unauthorized" />;
  }
  return (
    <>
      <Reports />
    </>
  );
};

export default ReportsPage;
