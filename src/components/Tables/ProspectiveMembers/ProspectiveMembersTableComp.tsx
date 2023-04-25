import ProspectiveMembersTable from "./ProspectiveMembersTable";
import { approvedApplication, pendingApplication } from "../MockData";
//@ts-ignore
import { IndeterminateCheckbox } from "../Checkbox";
import { TableView } from "../Tables.styles";
import { Hooks } from "react-table";
import { Link } from "react-router-dom";

export const ProspectiveMembersTableApproved = () => {
  //   const { isLoading, isError, data, isFetching } = useQuery(
  //     "all-approved-applications",
  //     {
  //       select: (data) => data.data,
  //       refetchOnWindowFocus: false,
  //     }
  //   );

  const columns = [
    {
      Header: "Company Name",
      accessor: "company_name",
    },
    {
      Header: "CAC Number",
      accessor: "cac_number",
    },
    {
      Header: "Application Date",
      accessor: "application_date",
    },
    {
      Header: "Approval Date",
      accessor: "approval_date",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ];

  const selectionHook = (hooks: any) => {
    hooks.visibleColumns.push((columns: any) => [
      // Let's make a column for selection
      {
        id: "selection",
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        Header: ({
          getToggleAllRowsSelectedProps,
        }: {
          getToggleAllRowsSelectedProps: any;
        }) => (
          <div>
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }: { row: any }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      ...columns,
    ]);
  };

  return (
    <>
      {/* {isFetching || isLoading ? (
        <Loading loading={isFetching || isLoading} />
      ) : !isError ? ( */}
      <ProspectiveMembersTable
        tableColumn={columns}
        tableData={approvedApplication}
        customHooks={[selectionHook]}
      />
      {/* ) : (
        <FormError>Cant Fetch Approved Application</FormError>
      )} */}
    </>
  );
};

export const ProspectiveMembersTablePending = () => {
  //   const { isLoading, isError, data, isFetching } = useQuery(
  //     "all-approved-applications",
  //     {
  //       select: (data) => data.data,
  //       refetchOnWindowFocus: false,
  //     }
  //   );

  const columns = [
    {
      Header: "Company Name",
      accessor: "company_name",
    },
    {
      Header: "CAC Number",
      accessor: "cac_number",
    },
    {
      Header: "Application Date",
      accessor: "application_date",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ];

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Click to Edit",
        Header: "Click to Edit",
        Cell: ({ row }) => (
          <TableView>
            {" "}
            <Link
              to={"/prospective-members/form-one"}
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

  const selectionHook = (hooks: any) => {
    hooks.visibleColumns.push((columns: any) => [
      // Let's make a column for selection
      {
        id: "selection",
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        Header: ({
          getToggleAllRowsSelectedProps,
        }: {
          getToggleAllRowsSelectedProps: any;
        }) => (
          <div>
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }: { row: any }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      ...columns,
    ]);
  };

  return (
    <>
      {/* {isFetching || isLoading ? (
        <Loading loading={isFetching || isLoading} />
      ) : !isError ? ( */}
      <ProspectiveMembersTable
        tableColumn={columns}
        tableData={pendingApplication}
        customHooks={[tableHooks, selectionHook]}
      />
      {/* ) : (
        <FormError>Cant Fetch Approved Application</FormError>
      )} */}
    </>
  );
};
