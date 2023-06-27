import React, { useState } from "react";
import {
  ApplicationFilter,
  ApplicationsTabItem,
  ApplicationsTabItems,
} from "./ProspectiveMemers.styles";
import {
  ProspectiveMembersTableApproved,
  ProspectiveMembersTablePending,
} from "../Tables/ProspectiveMembers/ProspectiveMembersTableComp";
import { useAuthStore } from "../../zustand/store";
import { Navigate } from "react-router-dom";

const ProspectiveMembers = () => {
  const [options, setOptions] = useState<"approval_in_progress" | "final_approval"|'acknowledgement_of_application'|'inspection_of_factory_inspection'|'ready_for_presentation_of_national_council'>("approval_in_progress");
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
        <ApplicationsTabItem
          isFilled={options === "approval_in_progress" ? true : false}
          onClick={() => setOptions("approval_in_progress")}
        >
          Applications Pending
        </ApplicationsTabItem>


        <ApplicationsTabItem
          isFilled={options === "acknowledgement_of_application" ? true : false}
          onClick={() => setOptions("acknowledgement_of_application")}
        >
 Acknowledgement Of Application
        </ApplicationsTabItem>

        
        <ApplicationsTabItem
          isFilled={options === "inspection_of_factory_inspection" ? true : false}
          onClick={() => setOptions("inspection_of_factory_inspection")}
        >
          Inspection Of Factory Inspection
        </ApplicationsTabItem>


        <ApplicationsTabItem
          isFilled={options === "ready_for_presentation_of_national_council" ? true : false}
          onClick={() => setOptions("ready_for_presentation_of_national_council")}
        >
         Ready For Presentation Of National Council
        </ApplicationsTabItem>


        <ApplicationsTabItem
          isFilled={options === "final_approval" ? true : false}
          onClick={() => setOptions("final_approval")}
        >
          Applications Approved
        </ApplicationsTabItem>
        {/* <ApplicationFilter>
          <option>12.03.23 - 20.03.23</option>
        </ApplicationFilter> */}
      </ApplicationsTabItems>


      <ProspectiveMembersTableApproved status={options} />
      {/* {options === "approved" ? <ProspectiveMembersTableApproved /> : null}
      {options === "pending" ? <ProspectiveMembersTablePending /> : null} */}
    </>
  );
};

export default ProspectiveMembers;
