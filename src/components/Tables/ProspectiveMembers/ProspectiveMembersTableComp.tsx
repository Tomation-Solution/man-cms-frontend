import ProspectiveMembersTable from "./ProspectiveMembersTable";
import { approvedApplication, pendingApplication } from "../MockData";
//@ts-ignore
import { IndeterminateCheckbox } from "../Checkbox";
import { TableView } from "../Tables.styles";
import { Hooks } from "react-table";
import { Link } from "react-router-dom";
import { getprospectiveMemberSubmission } from "../../../axios/api-calls";
import { useQuery } from "react-query";
import { datefromatter } from "../../../utils/DateFormatter";
import Loading from "../../Loading/Loading";

export const ProspectiveMembersTableApproved = ({status}:{status:string}) => {
  const { isLoading, isError, data, isFetching } = useQuery(
    ["all-approved-applications",status],
    ()=>getprospectiveMemberSubmission({'application_status':status?status:'approval_in_progress'}),
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
          approved
          </>
        ),
      },
      {
        id: "Click to View",
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
    <>
    <Loading loading={ isLoading} />
      {/* {isFetching || isLoading ? (
      ) : !isError ? ( */}
      <ProspectiveMembersTable
        tableColumn={columns}
        tableData={data?data:[]}
        customHooks={[tableHooks]}
      />
      {/* ) : (
        <FormError>Cant Fetch Approved Application</FormError>
      )} */}
    </>
  );
};

export const ProspectiveMembersTablePending = () => {
    const { isLoading, isError, data, isFetching } = useQuery(
      "all-approved-applications",
      ()=>getprospectiveMemberSubmission({'application_status':'approval_in_progress'}),
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
          pending
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
    <>
    <Loading loading={ isLoading} />

      {/* {isFetching || isLoading ? (
        <Loading loading={isFetching || isLoading} />
      ) : !isError ? ( */}
      <ProspectiveMembersTable
        tableColumn={columns}
        tableData={data?data:[]}
        // tableData={pendingApplication}
        customHooks={[tableHooks,]}
      />
      {/* ) : (
        <FormError>Cant Fetch Approved Application</FormError>
      )} */}
    </>
  );
};
