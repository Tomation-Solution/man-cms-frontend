import React from "react";
import Trainings from "../components/Trainings/Trainings";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../zustand/store";

const TrainingsPage = () => {
  const userData = useAuthStore.getState().user;

  if (!["super_user", "event_training"].includes(String(userData?.user_type))) {
    return <Navigate to="/unauthorized" />;
  }
  return (
    <>
      <Trainings />
    </>
  );
};

export default TrainingsPage;
