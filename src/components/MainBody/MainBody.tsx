import React from "react";
import { MainContainer } from "./MainBody.styles";
import MainNavBar from "./MainNavBar/MainNavBar";
import { Outlet } from "react-router-dom";

const MainBody = () => {
  return (
    <MainContainer>
      <MainNavBar />
      {/*
      This controls the rendering of the other components as children of this component
      */}
      <Outlet />
    </MainContainer>
  );
};

export default MainBody;
