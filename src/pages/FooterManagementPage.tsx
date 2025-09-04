import FooterManagement from "../components/FooterManagement";
import { useAuthStore } from "../zustand/store";
import { Navigate } from "react-router-dom";

const FooterManagementPage = () => {
  const userData = useAuthStore.getState().user;

  // Check if user has permission to access this page
  if (
    !["super_user", "content_manager"].includes(String(userData?.user_type))
  ) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <>
      <FooterManagement />
    </>
  );
};

export default FooterManagementPage;
