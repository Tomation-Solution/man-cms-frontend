import React, { useState } from "react";
import { TableReject, TableView } from "../Tables.styles";
import { Hooks } from "react-table";
import Tables from "../Tables";
import { useQuery } from "react-query";
import { eventsGetAll } from "../../../axios/api-calls";
import Loading from "../../Loading/Loading";
import { FormError } from "../../../globals/styles/forms.styles";
import OffCanvas from "../../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import EditEventModal from "../../Modals/EventsModal/EditEventModal";
import DeleteEventModal from "../../Modals/EventsModal/DeleteEventModal";
import { formatMoney } from "../../../utils/moneyFormatter";
import Pagination from "../../Payments/Pagination";

const EventsTable = ({ isPastEvents }: { isPastEvents: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [id, setId] = useState(0);
  const [delId, setDelId] = useState(0);
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const closeSlider = () => setIsOpen(!isOpen);
  const closeDeleteSlider = () => setIsDeleteOpen(!isDeleteOpen);

  const { isLoading, isError, data, isFetching } = useQuery(
    ["all-events", page, isPastEvents],
    () =>
      eventsGetAll({
        page,
        page_size: pageSize,
        is_concluded: isPastEvents, // ✅ Backend filtering
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const totalPages = Math.ceil((data?.count || 0) / pageSize);
  const eventResults = data?.results || [];

  const columns = [
    {
      Header: "S/N",
      Cell: (tableProps: any) => {
        return <>{(page - 1) * pageSize + tableProps.row.index + 1}</>;
      },
    },
    { Header: "Name", accessor: "name" },
    { Header: "Start Date", accessor: "start_date" },
    { Header: "End Date", accessor: "end_date" },
  ];

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Price",
        Header: "Price",
        Cell: ({ row }: { row: any }) => (
          <p>{formatMoney(row.original.price)}</p>
        ),
      },
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
        <EditEventModal eventsId={id} closefn={closeSlider} />
      </OffCanvas>
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsDeleteOpen}
        isOpen={isDeleteOpen}
      >
        <DeleteEventModal eventId={delId} closefn={closeDeleteSlider} />
      </OffCanvas>

      {isFetching || isLoading ? (
        <Loading loading={isFetching || isLoading} />
      ) : !isError ? (
        <>
          <Tables
            tableColumn={columns}
            tableData={eventResults}
            customHooks={[tableHooks]}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <FormError>Can't Fetch Events</FormError>
      )}
    </>
  );
};

export default EventsTable;
