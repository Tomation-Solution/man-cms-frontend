import React from "react";
import ProspectiveMembersTable from "./ProspectiveMembersTable";
import { certificatesIssuing } from "../MockData";
//@ts-ignore
import { IndeterminateCheckbox } from "../Checkbox";
import { TableView } from "../Tables.styles";
import { Hooks } from "react-table";
import { Link } from "react-router-dom";

const CertificateIssuigTable = () => {
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
          <>
            {row.values.status === "pending" ? (
              <TableView>
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
            ) : (
              <TableView>
                <Link
                  to={"/prospective-members/form-one"}
                  style={{
                    textDecoration: "none",
                    color: "#2b3513",
                    fontWeight: 500,
                  }}
                >
                  Issue Certificate
                </Link>
              </TableView>
            )}
          </>
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
        tableData={certificatesIssuing}
        customHooks={[tableHooks, selectionHook]}
      />
      {/* ) : (
        <FormError>Cant Fetch Approved Application</FormError>
      )} */}
    </>
  );
};

export default CertificateIssuigTable;
