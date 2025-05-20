import React from "react";
import { useAuthStore } from "../zustand/store";
import { Navigate } from "react-router-dom";
import Admins from "../components/Admins/Admins";

const AdminsPage = () => {
  const userData = useAuthStore.getState().user;

  if (!["super_user"].includes(String(userData?.user_type))) {
    return <Navigate to="/unauthorized" />;
  }

  return <Admins />;
};

export default AdminsPage;
