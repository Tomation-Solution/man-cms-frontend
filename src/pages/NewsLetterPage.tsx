import React from "react";
import NewLetterSubscriptions from "../components/NewLetterSubscriptions/NewLetterSubscriptions";
import { useAuthStore } from "../zustand/store";
import { Navigate } from "react-router-dom";

const NewsLetterPage = () => {
  const userData = useAuthStore.getState().user;

  if (!["super_user", "public_view"].includes(String(userData?.user_type))) {
    return <Navigate to="/unauthorized" />;
  }
  return (
    <>
      <NewLetterSubscriptions />
    </>
  );
};

export default NewsLetterPage;
