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
  const [options, setOptions] = useState<"pending" | "approved">("pending");
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
          isFilled={options === "pending" ? true : false}
          onClick={() => setOptions("pending")}
        >
          Applications Pending
        </ApplicationsTabItem>
        <ApplicationsTabItem
          isFilled={options === "approved" ? true : false}
          onClick={() => setOptions("approved")}
        >
          Applications Approved
        </ApplicationsTabItem>
        {/* <ApplicationFilter>
          <option>12.03.23 - 20.03.23</option>
        </ApplicationFilter> */}
      </ApplicationsTabItems>

      {options === "approved" ? <ProspectiveMembersTableApproved /> : null}
      {options === "pending" ? <ProspectiveMembersTablePending /> : null}
    </>
  );
};

export default ProspectiveMembers;
