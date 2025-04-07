import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import OffCanvas from "../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import { TableReject, TableView } from "../Tables/Tables.styles";
import { Hooks } from "react-table";
import Tables from "../Tables/Tables";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteHomeSliderApi,
  getHomeSliderApi,
  getArchivedSliderApi,
  archiveHomeSliderApi,
  unArchiveHomeSliderApi,
  getHomeSliderWIthUrlApi,
} from "../../axios/api-calls";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CreateSlider from "./_components/CreateSlider";
import DeleteConfirmationModal from "./_components/DeleteConfirmationModal";

const HomePageSlider = () => {
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [viewArchived, setViewArchived] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [data, setData] = useState([]);

  const [nextPageUrl, setNextPageUrl] = useState("");
  const [prevPageUrl, setPrevPageUrl] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const [countPerPage, setCountPerPage] = useState(5);
  const [fetchUrl, setfetchUrl] = useState("homepage/add-slider/get_slider/");
  const [fetchArchivedUrl, setFetchArchivedUrl] = useState(
    "homepage/add-slider/get_slider/?archived=true"
  );

  const [minSN, setMinSN] = useState(0);

  const { isLoading, data: results } = useQuery(
    [
      viewArchived ? "getArchivedSliderApi" : "getHomeSliderApi",
      viewArchived ? fetchArchivedUrl : fetchUrl,
    ],
    () => getHomeSliderWIthUrlApi(viewArchived ? fetchArchivedUrl : fetchUrl),
    {
      enabled: !!(viewArchived ? fetchArchivedUrl : fetchUrl),
    }
  );

  function getPageNumber(url: string) {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("page") || null;
  }

  function updateQueryParams(url: string, params: { [key: string]: string }) {
    const urlObj = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });
    return urlObj.toString();
  }

  //   useEffect(() => {
  //     if (fetchArchivedUrl || fetchUrl) refetch();
  //   }, [fetchArchivedUrl, fetchUrl]);

  useEffect(() => {
    if (results?.results) {
      setData(results.results);
      setNextPageUrl(results.next);
      setPrevPageUrl(results.previous);

      let currentPage = 0;
      if (results.next) {
        const nextPageNumber = getPageNumber(results.next);
        currentPage = Number(nextPageNumber) - 1;
      } else if (results.previous) {
        const prevPageNumber = getPageNumber(results.previous);
        currentPage = Number(prevPageNumber || 1) + 1;
      } else {
        currentPage = 1;
      }

      // Calculate Minimum S/N Number
      const maxSN = currentPage * countPerPage;
      setMinSN(maxSN - countPerPage);
      setPageNumber(currentPage);
    }
  }, [results]);

  const { mutate: deleteFunc, isLoading: deleting } = useMutation(
    deleteHomeSliderApi,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          viewArchived ? "getArchivedSliderApi" : "getHomeSliderApi"
        );
        toast.success("Deleted!", {
          progressClassName: "toastProgress",
          icon: false,
        });
        setDeleteModalOpen(false);
      },
    }
  );

  const { mutate: archiveFunc, isLoading: archiving } = useMutation(
    archiveHomeSliderApi,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getHomeSliderApi");
        toast.success("Archived!", {
          progressClassName: "toastProgress",
          icon: false,
        });
        setDeleteModalOpen(false);
      },
    }
  );

  const { mutate: unArchiveFunc, isLoading: unArchiving } = useMutation(
    unArchiveHomeSliderApi,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getArchivedSliderApi");
        toast.success("Removed From Archive!", {
          progressClassName: "toastProgress",
          icon: false,
        });
        setDeleteModalOpen(false);
      },
    }
  );

  const columns = [
    {
      Header: "Title",
      accessor: "title",
      id: 1,
    },
    {
      Header: "Content",
      accessor: "content",
      id: 2,
    },
    {
      Header: "Display Order",
      accessor: "order_position",
      id: 3,
    },
  ];

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) =>
      viewArchived
        ? [
            {
              id: "s/n",
              Header: "S/N",
              Cell: (tableProp: any) => (
                <>{minSN + (tableProp.row.index + 1)}</>
              ),
            },
            ...columns,
            {
              id: "Banner",
              Header: "Banner",
              Cell: (tableProp: any) => (
                <img
                  style={{ width: "50px", height: "50px" }}
                  src={tableProp.row.original.banner}
                  alt="banner"
                />
              ),
            },
            {
              id: "Make Active",
              Header: "Make Active",
              Cell: (tableProp: any) => (
                <TableView
                  onClick={() => unArchiveFunc(tableProp.row.original.id)}
                >
                  Make Active
                </TableView>
              ),
            },
            {
              id: "Delete",
              Header: "Delete",
              Cell: (tableProp: any) => (
                <TableReject
                  onClick={() => {
                    setItemToDelete(tableProp.row.original);
                    setDeleteModalOpen(true);
                  }}
                >
                  Delete
                </TableReject>
              ),
            },
          ]
        : [
            {
              id: "s/n",
              Header: "S/N",
              Cell: (tableProps: any) => {
                return <>{minSN + (tableProps.row.index + 1)}</>;
              },
            },
            ...columns,

            {
              id: "Banner",
              Header: "Banner",
              Cell: (tableProp: any) => (
                <>
                  <img
                    style={{ width: "50px", height: "50px" }}
                    src={tableProp.row.original.banner}
                  />
                </>
              ),
            },
            {
              id: "Click to Edit",
              Header: "Click to Edit",
              Cell: ({ row }: any) => (
                <TableView
                  onClick={() => {
                    setCurrentData(row.original);
                    setIsOpenUpdate(true);
                  }}
                >
                  Edit
                </TableView>
              ),
            },
            {
              id: "Click to Archive",
              Header: "Click to Archive",
              Cell: (tableProp: any) => (
                <TableView
                  onClick={() => archiveFunc(tableProp.row.original.id)}
                >
                  Archive
                </TableView>
              ),
            },
            {
              id: "Click to Delete",
              Header: "Click to Delete",
              Cell: (tableProp: any) => (
                <TableReject
                  onClick={() => {
                    if (tableProp.row.original?.id) {
                      // deleteFunc(row.original.id);

                      setDeleteModalOpen(true);
                      setItemToDelete(tableProp.row.original);
                    }
                  }}
                >
                  Delete
                </TableReject>
              ),
            },
          ]
    );
  };

  return (
    <div>
      <Loading loading={isLoading || deleting || archiving || unArchiving} />
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        <CreateSlider />
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpenUpdate}
        isOpen={isOpenUpdate}
      >
        {currentData && <CreateSlider sliderInstance={currentData} />}
      </OffCanvas>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button styleType="whiteBg" onClick={() => setIsOpen(true)}>
          Create
        </Button>
        <Button
          styleType="whiteBg"
          onClick={() => {
            if (viewArchived) setfetchUrl("homepage/add-slider/get_slider/");
            if (!viewArchived)
              setFetchArchivedUrl(
                "homepage/add-slider/get_slider/?archived=true"
              );
            setViewArchived(!viewArchived);
          }}
        >
          {viewArchived ? "View Active" : "View Archived"}
        </Button>
      </div>

      <Tables
        tableColumn={columns}
        tableData={data || []}
        customHooks={[tableHooks]}
        dangerouslySetHtmlIndex={2}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          marginBottom: "2rem",
          gap: ".5rem",
        }}
      >
        <Button
          style={{
            opacity: !nextPageUrl ? "0.5" : "1",
          }}
          disabled={!nextPageUrl}
          styleType="pry"
          onClick={() => {
            if (!viewArchived) {
              const url = updateQueryParams(nextPageUrl, { archived: "false" });
              setfetchUrl(url);
            } else {
              const url = updateQueryParams(nextPageUrl, { archived: "true" });
              setFetchArchivedUrl(url);
            }
          }}
        >
          Next
        </Button>
        <Button
          style={{
            opacity: !prevPageUrl ? "0.5" : "1",
          }}
          disabled={!prevPageUrl}
          styleType="pry"
          onClick={() => {
            if (!viewArchived) {
              const url = updateQueryParams(prevPageUrl, { archived: "false" });
              setfetchUrl(url);
            } else {
              const url = updateQueryParams(prevPageUrl, { archived: "true" });
              setFetchArchivedUrl(url);
            }
          }}
        >
          Prev
        </Button>
      </div>

      {deleteModalOpen && (
        <DeleteConfirmationModal
          item={itemToDelete}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={() => deleteFunc(itemToDelete.id)}
          onArchive={() => archiveFunc(itemToDelete.id)}
        />
      )}
    </div>
  );
};

export default HomePageSlider;
