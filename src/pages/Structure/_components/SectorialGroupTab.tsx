import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteSectoralGroupApi,
  getSectoralGroupApi,
} from "../../../axios/api-calls";
import { toast } from "react-toastify";
import {
  TableReject,
  TableView,
} from "../../../components/Tables/Tables.styles";
import CreateSectoralGroupModal, {
  UpdateGroupModal,
} from "../../../components/Modals/SectoralGroupModal";
import OffCanvas from "../../../components/OffCanvas/OffCanvas";
import Pagination from "../../../components/Payments/Pagination";
import Tables from "../../../components/Tables/Tables";
import Button from "../../../components/Button/Button";
import Loading from "../../../components/Loading/Loading";
import SectorialUpdateBanner from "../../../components/Modals/SectorialModals/sectorialUpdateBanner";

const ITEMS_PER_PAGE = 10;

const SectoralGroupTab = () => {
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(false);

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [currentData, setCurrentData] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading, data } = useQuery(
    ["get-sectoral", currentPage],
    () => getSectoralGroupApi(currentPage),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const { isLoading: deleting, mutate: deleteSectoralGroup } = useMutation(
    deleteSectoralGroupApi,
    {
      onSuccess: () => {
        toast.error(`Deleted Sectoral Group`, {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("get-sectoral");
      },
    }
  );

  const columns = [
    {
      Header: "Header",
      accessor: "header",
    },
  ];

  const tableHooks = (hooks: any) => {
    hooks.visibleColumns.push((columns: any[]) => [
      {
        id: "s/n",
        Header: "S/N",
        Cell: (tableProps: any) => (
          <>{(currentPage - 1) * ITEMS_PER_PAGE + tableProps.row.index + 1}</>
        ),
      },
      ...columns,
      {
        id: "images",
        Header: "Image",
        Cell: (tableProp: any) => (
          <img
            style={{ width: "50px", height: "50px" }}
            src={tableProp.row.original.image}
            alt=""
          />
        ),
      },
      {
        id: "edit",
        Header: "Click to Edit",
        Cell: ({ row }: any) => (
          <TableView
            onClick={() => {
              setIsUpdateOpen(true);
              setCurrentData(row.original);
            }}
          >
            Edit
          </TableView>
        ),
      },
      {
        id: "delete",
        Header: "Click to Delete",
        Cell: ({ row }: any) => (
          <TableReject
            onClick={() => {
              if (row.original?.id) {
                deleteSectoralGroup(row.original.id);
              }
            }}
          >
            Delete
          </TableReject>
        ),
      },
    ]);
  };

  const totalPages = Math.ceil((data?.count || 0) / ITEMS_PER_PAGE);

  return (
    <div>
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        <CreateSectoralGroupModal />
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsUpdateOpen}
        isOpen={isUpdateOpen}
      >
        <UpdateGroupModal data={currentData} />
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsBannerOpen}
        isOpen={isBannerOpen}
      >
        <SectorialUpdateBanner closefn={() => setIsBannerOpen(!isBannerOpen)} />
      </OffCanvas>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
          gap: "15px",
        }}
      >
        <Button styleType={"sec"} onClick={() => setIsOpen(true)}>
          Create Sectoral Group
        </Button>
        <Button
          styleType={"sec"}
          onClick={() => setIsBannerOpen(!isBannerOpen)}
        >
          Update Banner
        </Button>
      </div>

      <Loading loading={isLoading || deleting} />

      <Tables
        tableColumn={columns}
        tableData={data?.results || []}
        customHooks={[tableHooks]}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default SectoralGroupTab;
