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

const ProspectiveMembers = () => {
  const [options, setOptions] = useState<'pending'|'approved'>("pending");
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
        <ApplicationFilter>
          <option>12.03.23 - 20.03.23</option>
        </ApplicationFilter>
      </ApplicationsTabItems>

      {options === "approved" ? <ProspectiveMembersTableApproved /> : null}
      {options === "pending" ? <ProspectiveMembersTablePending /> : null}
    </>
  );
};

export default ProspectiveMembers;
