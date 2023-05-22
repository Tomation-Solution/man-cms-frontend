import React from "react";
import Gallery from "../components/Gallery/Gallery";
import { useAuthStore } from "../zustand/store";
import { Navigate } from "react-router-dom";

const GalleryPage = () => {
  const userData = useAuthStore.getState().user;

  if (
    !["super_user", "publication_news"].includes(String(userData?.user_type))
  ) {
    return <Navigate to="/unauthorized" />;
  }
  return (
    <>
      <Gallery />
    </>
  );
};

export default GalleryPage;
