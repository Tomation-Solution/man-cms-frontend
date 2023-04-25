import { TableReject, TableView } from "../Tables.styles";
import { Hooks } from "react-table";
import Tables from "../Tables";
import { useQuery } from "react-query";
import { operateOfficeGetAll } from "../../../axios/api-calls";
import Loading from "../../Loading/Loading";
import { FormError } from "../../../globals/styles/forms.styles";
import OffCanvas from "../../OffCanvas/OffCanvas";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import EditOffice from "../../Modals/OperateOffice/EditOffice";
import DeleteOffice from "../../Modals/OperateOffice/DeleteOffice";

const OfficeTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [id, setId] = useState(0);
  const [delId, setDelId] = useState(0);
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  const closeSlider = () => {
    setIsOpen(!isOpen);
  };
  const closeDeleteSlider = () => {
    setIsDeleteOpen(!isDeleteOpen);
  };

  const { isLoading, isError, data, isFetching } = useQuery(
    "all-operate-office",
    operateOfficeGetAll,
    {
      select: (data) => {
        return data.data.sort((a: any, b: any) => b.id - a.id);
      },
      refetchOnWindowFocus: false,
    }
  );

  const columns = [
    {
      Header: "S/N",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Address",
      accessor: "address",
    },
  ];

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Click to Edit",
        Header: "Click to Edit",
        Cell: ({ row }) => (
          <TableView
            onClick={() => {
              setId(row.values.id);
              closeSlider();
            }}
          >
            Edit
          </TableView>
        ),
      },
      {
        id: "Click to Delete",
        Header: "Click to Delete",
        Cell: ({ row }) => (
          <TableReject
            onClick={() => {
              setDelId(row.values.id);
              closeDeleteSlider();
            }}
          >
            Delete
          </TableReject>
        ),
      },
    ]);
  };

  return (
    <>
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        <EditOffice closefn={closeSlider} id={id} />
      </OffCanvas>
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsDeleteOpen}
        isOpen={isDeleteOpen}
      >
        <DeleteOffice pubid={delId} closefn={closeDeleteSlider} />
      </OffCanvas>

      {isFetching || isLoading ? (
        <Loading loading={isFetching || isLoading} />
      ) : !isError ? (
        <Tables
          tableColumn={columns}
          tableData={data}
          customHooks={[tableHooks]}
        />
      ) : (
        <FormError>Cant Fetch Offices</FormError>
      )}
    </>
  );
};

export default OfficeTable;
