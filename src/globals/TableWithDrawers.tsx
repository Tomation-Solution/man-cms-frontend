import { useMediaQuery } from "react-responsive";
import OffCanvas from "../components/OffCanvas/OffCanvas";
import Tables from "../components/Tables/Tables";
import { useState } from "react";
import { Hooks, Row } from "react-table";
import { TableReject, TableView } from "../components/Tables/Tables.styles";

type ColumnsType = {
  Header: string;
  accessor: string;
  id?: number;
  Cell?: any;
};

type Props = {
  columns: ColumnsType[];
  tableData: any;
  noEdit?: boolean;
  editModalComponent: any;
  deleteModalComponent: any;
};

function TableWithDrawers({
  columns,
  tableData,
  noEdit,
  editModalComponent: EditModalComponent,
  deleteModalComponent: DeleteModalComponent,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemId, setId] = useState(0);
  const [delId, setDelId] = useState(0);
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  const closeSlider = () => {
    setIsOpen(!isOpen);
  };
  const closeDeleteSlider = () => {
    setIsDeleteOpen(!isDeleteOpen);
  };

  let editableHook: any;

  editableHook = noEdit
    ? {}
    : {
        id: "Click to Edit",
        Header: "Click to Edit",
        Cell: ({ row }: { row: Row }) => (
          <TableView
            onClick={() => {
              //@ts-ignore
              setId(row.original.id);
              closeSlider();
            }}
          >
            Edit
          </TableView>
        ),
      };

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      editableHook,
      {
        id: "Click to Delete",
        Header: "Click to Delete",
        Cell: ({ row }: { row: Row }) => (
          <TableReject
            onClick={() => {
              //@ts-ignore
              setDelId(row.original.id);
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
        {noEdit ? null : (
          <EditModalComponent itemId={itemId} closefn={closeSlider} />
        )}
      </OffCanvas>
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsDeleteOpen}
        isOpen={isDeleteOpen}
      >
        <DeleteModalComponent itemId={delId} closefn={closeDeleteSlider} />
      </OffCanvas>

      <Tables
        tableColumn={columns}
        tableData={tableData}
        customHooks={[tableHooks]}
      />
    </>
  );
}

export default TableWithDrawers;
