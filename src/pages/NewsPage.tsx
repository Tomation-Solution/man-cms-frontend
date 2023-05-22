import React from "react";
import News from "../components/News/News";
import { useAuthStore } from "../zustand/store";
import { Navigate } from "react-router-dom";

const NewsPage = () => {
  const userData = useAuthStore.getState().user;

  if (
    !["super_user", "publication_news"].includes(String(userData?.user_type))
  ) {
    return <Navigate to="/unauthorized" />;
  }
  return (
    <>
      <News />
    </>
  );
};

export default NewsPage;
