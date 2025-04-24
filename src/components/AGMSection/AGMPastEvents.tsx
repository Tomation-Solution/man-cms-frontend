import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMediaQuery } from "react-responsive";
import { Hooks } from "react-table";
import { eventsGetAll } from "../../axios/api-calls";
import { FormError } from "../../globals/styles/forms.styles";
import { formatMoney } from "../../utils/moneyFormatter";
import Loading from "../Loading/Loading";
import DeleteEventModal from "../Modals/EventsModal/DeleteEventModal";
import EditEventModal from "../Modals/EventsModal/EditEventModal";
import OffCanvas from "../OffCanvas/OffCanvas";
import Pagination from "../Payments/Pagination";
import Tables from "../Tables/Tables";
import { TableView, TableReject } from "../Tables/Tables.styles";
import SetCurrentAGMModal from "../Modals/EventsModal/setCurrentAGMModal";

export default function AGMPastEvents() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCurrentAGMOpen, setIsCurrentAGMOpen] = useState(false);
  const [id, setId] = useState(0);
  const [delId, setDelId] = useState(0);
  const [currentAGMId, setCurrentAGMId] = useState(0);
  const [currentAGMName, setCurrentAGMName] = useState("");
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const closeSlider = () => setIsOpen(!isOpen);
  const closeCurrentAGMSlider = () => setIsCurrentAGMOpen(!isCurrentAGMOpen);
  const closeDeleteSlider = () => setIsDeleteOpen(!isDeleteOpen);

  const { isLoading, isError, data, isFetching } = useQuery(
    ["all-events", page],
    () =>
      eventsGetAll({
        page,
        page_size: pageSize,
        is_agm: true,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const totalPages = Math.ceil((data?.count || 0) / pageSize);
  const eventResults = data?.results || [];

  useEffect(() => {
    console.log(id);

    if (id) {
      window.location.href = `/agm-section/${id}`;
    }
  }, [id]);

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
              setId((row.original as any)?.id);
              //   closeSlider();
            }}
          >
            Edit
          </TableView>
        ),
      },
      {
        id: "Click to Make Current",
        Header: "Click to Make Current",
        Cell: ({ row }) => (
          <TableView
            onClick={() => {
              setCurrentAGMId((row.original as any)?.id);
              setCurrentAGMName((row.original as any)?.name);
              closeCurrentAGMSlider();
            }}
          >
            Make Current AGM
          </TableView>
        ),
      },
      {
        id: "Click to Delete",
        Header: "Click to Delete",
        Cell: ({ row }) => (
          <TableReject
            onClick={() => {
              setDelId((row.original as any)?.id);
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
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsCurrentAGMOpen}
        isOpen={isCurrentAGMOpen}
      >
        <SetCurrentAGMModal
          eventId={currentAGMId}
          closefn={closeCurrentAGMSlider}
          eventName={currentAGMName}
        />
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
}
