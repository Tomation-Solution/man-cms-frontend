import { useQuery } from "react-query";
import { getprospectiveMemberSubmission } from "../../axios/api-calls";
import ProspectiveMembersTable from "../Tables/ProspectiveMembers/ProspectiveMembersTable"
import { TableView } from "../Tables/Tables.styles";
import { Link } from "react-router-dom";
import { Hooks } from "react-table";
import { datefromatter } from "../../utils/DateFormatter";
import Loading from "../Loading/Loading";
import { useAuthStore } from "../../zustand/store";
import { ApplicationsTabItem, ApplicationsTabItems } from "./ProspectiveMemers.styles";
import { useState } from "react";




const ExecutiveMemberViewPage = ()=>{
    const userData = useAuthStore.getState().user;
    // const [options,setOptions] =useState<'approval_in_progress'|'rework'>('approval_in_progress')
  const { isLoading, isError, data, isFetching } = useQuery(
    ["all-approved-applications",userData?.email,],
    ()=>getprospectiveMemberSubmission({
        'executive_email':userData?.email,
        // 'application_status':options
    }),
    {
      // select: (data) => data.data,
      refetchOnWindowFocus: false,
    }
  );
  const columns = [
    {
      Header: "Company Name",
      accessor: "name_of_company",
    },
    {
      Header: "CAC Number",
      accessor: "cac_registration_number",
    },
   
   
  ];
  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        Header: "Application Date",
        accessor: "created_at",
        Cell: ({ row }:any) => (
          <>
            {" "}
            {row.original.created_at?datefromatter(new Date(row.original.created_at as string)):''}
          </>
        ),
      },
      {
        Header: "Status",
        id:'Status',
        accessor: "status",
        Cell: ({ row }:any) => (
          <>
          {row.original.application_status}
          </>
        ),
      },
      {
        id: "Click to Edit",
        Header: "Click to Edit",
        Cell: ({ row }:any) => (
          <TableView>
            {" "}
            <Link
              to={"/prospective-members/details/"+row.original.id}
              style={{
                textDecoration: "none",
                color: "#2b3513",
                fontWeight: 500,
              }}
            >
              Click to View
            </Link>
          </TableView>
        ),
      },
    ]);
  };
    return (
        <div>

{/* <ApplicationsTabItems>
        <ApplicationsTabItem
          isFilled={options === "approval_in_progress" ? true : false}
          onClick={() => setOptions("approval_in_progress")}
        >
          Applications Pending
        </ApplicationsTabItem>


        <ApplicationsTabItem
          isFilled={options === "rework" ? true : false}
          onClick={() => setOptions("rework")}
        >
          Rework
        </ApplicationsTabItem>

      </ApplicationsTabItems> */}
            <Loading loading={isLoading}/>
                 <ProspectiveMembersTable
        tableColumn={columns}
        // @ts-ignore
        tableData={data?data.filter((e=>e.application_status==='rework'||e.application_status==='application_pending')):[]}
        // tableData={pendingApplication}
        customHooks={[tableHooks,]}
      /> 
        </div>
    )
}


export default ExecutiveMemberViewPage