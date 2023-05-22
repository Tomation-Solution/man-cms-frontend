import React from "react";
import Events from "../components/Events/Events";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../zustand/store";

const EventsPage = () => {
  const userData = useAuthStore.getState().user;

  if (!["super_user", "event_training"].includes(String(userData?.user_type))) {
    return <Navigate to="/unauthorized" />;
  }
  return (
    <>
      <Events />
    </>
  );
};

export default EventsPage;
