import React, { useState } from "react";
import { TableReject, TableView } from "../Tables.styles";
import Tables from "../Tables";
import { useQuery } from "react-query";
import { trainingsGetAll } from "../../../axios/api-calls";
import Loading from "../../Loading/Loading";
import { FormError } from "../../../globals/styles/forms.styles";
import OffCanvas from "../../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import EditTrainingsModal from "../../Modals/TrainingsModal/EditTrainingsModal";
import DeleteTrainingsModal from "../../Modals/TrainingsModal/DeleteTrainingsModal";
import { formatMoney } from "../../../utils/moneyFormatter";
import Pagination from "../../Payments/Pagination";

const TrainingTable = ({ isPastTrainings }: { isPastTrainings: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [id, setId] = useState(0);
  const [delId, setDelId] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  const closeSlider = () => setIsOpen(false);
  const closeDeleteSlider = () => setIsDeleteOpen(false);

  const { isLoading, isError, data, isFetching } = useQuery(
    ["trainings", page, isPastTrainings],
    () => trainingsGetAll({ page, is_concluded: isPastTrainings }),
    {
      keepPreviousData: true,
      // select: (data) => data.data,
    }
  );

  const totalPages = Math.ceil((data?.count || 0) / pageSize);
  const columns = [
    {
      Header: "S/N",
      accessor: "id",
      Cell: ({ row }: { row: any }) => (page - 1) * pageSize + row.index + 1,
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Start Date",
      accessor: "start_date",
    },
    {
      Header: "End Date",
      accessor: "end_date",
    },
  ];

  const tableHooks = (hooks: any) => {
    hooks.visibleColumns.push((columns: any[]) => [
      ...columns,
      {
        id: "Price",
        Header: "Price",
        Cell: ({ row }: { row: any }) => (
          <p>{formatMoney(row.original.price)}</p>
        ),
      },
      {
        id: "Edit",
        Header: "Edit",
        Cell: ({ row }: { row: any }) => (
          <TableView
            onClick={() => {
              setId(row.original.id);
              setIsOpen(true);
            }}
          >
            Edit
          </TableView>
        ),
      },
      {
        id: "Delete",
        Header: "Delete",
        Cell: ({ row }: { row: any }) => (
          <TableReject
            onClick={() => {
              setDelId(row.original.id);
              setIsDeleteOpen(true);
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
        <EditTrainingsModal trainingsId={id} closefn={closeSlider} />
      </OffCanvas>
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsDeleteOpen}
        isOpen={isDeleteOpen}
      >
        <DeleteTrainingsModal trainingsId={delId} closefn={closeDeleteSlider} />
      </OffCanvas>

      {isLoading || isFetching ? (
        <Loading loading={true} />
      ) : isError ? (
        <FormError>Can't Fetch Trainings</FormError>
      ) : (
        <>
          <Tables
            tableColumn={columns}
            tableData={data?.results || []}
            customHooks={[tableHooks]}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  );
};

export default TrainingTable;
