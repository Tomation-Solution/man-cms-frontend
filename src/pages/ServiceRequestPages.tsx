import React from "react";
import ServiceRequest from "../components/ServiceRequest/ServiceRequest";
import { useAuthStore } from "../zustand/store";
import { Navigate } from "react-router-dom";

const ServiceRequestPages = () => {
  const userData = useAuthStore.getState().user;

  if (!["super_user", "public_view"].includes(String(userData?.user_type))) {
    return <Navigate to="/unauthorized" />;
  }
  return (
    <>
      <ServiceRequest />
    </>
  );
};

export default ServiceRequestPages;
