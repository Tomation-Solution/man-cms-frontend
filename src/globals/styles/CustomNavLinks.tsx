import React from "react";
import { NavLink } from "react-router-dom";

export const CustomSideBarNavLinks: React.FC<{
  children: React.ReactNode;
  where: string;
}> = ({ children, where }) => {
  return (
    <>
      <NavLink
        to={where}
        className={({ isActive }) =>
          isActive ? "nav-link-active" : "nav-link-inactive"
        }
      >
        {children}
      </NavLink>
    </>
  );
};
