import React from "react";
import {
  ApplicationFilter,
  ApplicationsTabItems,
} from "../ProspectiveMemers.styles";
import CertificateIssuigTable from "../../Tables/ProspectiveMembers/CertificateIssuigTable";

const CertificateIssuing = () => {
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
