import React from "react";
import {
  ApplicationFilter,
  ApplicationsTabItems,
} from "../ProspectiveMemers.styles";
import CertificateIssuigTable from "../../Tables/ProspectiveMembers/CertificateIssuigTable";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../zustand/store";

const CertificateIssuing = () => {
  const userData = useAuthStore.getState().user;

  if (
    !["super_user", "prospective_certificates"].includes(
      String(userData?.user_type)
    )
  ) {
    return <Navigate to="/unauthorized" />;
  }
  return (
    <>
      <ApplicationsTabItems>
        <ApplicationFilter>
          <option>12.03.23 - 20.03.23</option>
        </ApplicationFilter>
      </ApplicationsTabItems>

      <CertificateIssuigTable />
    </>
  );
};

export default CertificateIssuing;
