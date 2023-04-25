import React from "react";
import { Navigate } from "react-router-dom";
import MainBody from "../components/MainBody/MainBody";
import SideBar from "../components/SideBar/SideBar";
import { useAuthStore } from "../zustand/store";

const MainLayout = () => {
  const userData = useAuthStore.getState().user;

  if (!userData || !userData.token || !userData.email) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <SideBar />
      <MainBody />
    </>
  );
};

export default MainLayout;
