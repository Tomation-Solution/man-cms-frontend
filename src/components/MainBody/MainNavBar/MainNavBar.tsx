import { useState } from "react";
import {
  MainNavContainer,
  MainNavContentHolder,
  MainNavLogoCon,
  MainNavProfile,
} from "./MainNavBar.styles";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiMenuFries } from "react-icons/ci";
import SideBar from "../../SideBar/SideBar";
import Logo from "../../../assets/Vector.png";

const MainNavBar = () => {
  const [showNav, setShowNav] = useState(false);

  const showNavHandler = () => {
    setShowNav(!showNav);
  };

  return (
    <>
      <SideBar show={showNav} />
      <MainNavLogoCon>
        <img alt="" src={Logo} />

        <CiMenuFries onClick={showNavHandler} />
      </MainNavLogoCon>
      <MainNavContainer>
        <MainNavContentHolder>
          <MainNavProfile>
            <IoIosNotificationsOutline />
            <p>Man Admin</p>

            <img alt="" src={"ProfileImg"} />
          </MainNavProfile>
        </MainNavContentHolder>
      </MainNavContainer>
    </>
  );
};

export default MainNavBar;
