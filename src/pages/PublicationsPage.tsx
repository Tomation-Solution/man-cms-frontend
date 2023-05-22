import React from "react";
import Publications from "../components/Publications/Publications";
import { useAuthStore } from "../zustand/store";
import { Navigate } from "react-router-dom";

const PublicationsPage = () => {
  const userData = useAuthStore.getState().user;

  if (
    !["super_user", "publication_news"].includes(String(userData?.user_type))
  ) {
    return <Navigate to="/unauthorized" />;
  }
  return (
    <>
      <Publications />
    </>
  );
};

export default PublicationsPage;
