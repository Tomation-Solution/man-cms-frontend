import { TableReject, TableView } from "../Tables.styles";
import { Hooks } from "react-table";
import Tables from "../Tables";
import { useQuery } from "react-query";
import { publicationGetAll } from "../../../axios/api-calls";
import Loading from "../../Loading/Loading";
import { FormError } from "../../../globals/styles/forms.styles";
import OffCanvas from "../../OffCanvas/OffCanvas";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import EditPublicationsModal from "../../Modals/PublicationModal/EditPublicationsModal";
import DeleteModal from "../../Modals/PublicationModal/DeleteModal";
import numbro from "numbro";
import { formatMoney } from "../../../utils/moneyFormatter";
import Button from "../../Button/Button";

const PublicationTables = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [id, setId] = useState(0);

  const [delId, setDelId] = useState(0);
  const [delName, setDelName] = useState("");
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });
  const [data, setData] = useState<any[]>([]);

  const [nextUrl, setNextUrl] = useState("");
  const [url, setUrl] = useState(`/publications/`);
  const [updateNext, setUpdateNext] = useState<boolean>(true);

  const closeSlider = () => {
    setIsOpen(!isOpen);
  };
  const closeDeleteSlider = () => {
    setIsDeleteOpen(!isDeleteOpen);
  };

  const {
    isLoading,
    isError,
    data: results,
    isFetching,
  } = useQuery(["all-publication", url], () => publicationGetAll(url), {
    refetchOnWindowFocus: false,
  });

  const columns = [
    {
      id: "s/n",
      Header: "S/N",
      Cell: (tableProp: any) => <>{tableProp.row.index + 1}</>,
    },
    {
      Header: "Name",
      accessor: "name",
    },
  ];

  useEffect(() => {
    if (!results) {
      setData((prevdata: any) => {
        if (prevdata.length) return prevdata;
        return [];
      });
    }

    if (results?.results) {
      setData((prevData: any[]) => {
        const existingIds = new Set(prevData.map((item) => item.id));
        const newData = results.results.filter(
          (item: any) => !existingIds.has(item.id)
        ); // Filter out duplicates

        const mergedData = [...prevData, ...newData]; // Append only new unique items
        return mergedData.sort(
          (a, b) =>
            new Date(String(b.updated_at)).getTime() -
            new Date(String(a.updated_at)).getTime()
        );
      });

      if (updateNext) {
        setNextUrl(results.next || null);
      }
      setUpdateNext(true);

      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth", // Optional: adds smooth scrolling effect
        });
      }, 500);
    }
  }, [results]);

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
              setId(Number((row.original as any).id));
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
              setDelId(Number((row.original as any).id));
              setDelName(String((row.original as any).name));
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
        <EditPublicationsModal pubid={id} close={closeSlider} />
      </OffCanvas>
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsDeleteOpen}
        isOpen={isDeleteOpen}
      >
        <DeleteModal
          pubid={delId}
          closefn={closeDeleteSlider}
          publicationName={delName}
        />
      </OffCanvas>

      {isFetching || isLoading ? (
        <Loading loading={isFetching || isLoading} />
      ) : !isError ? (
        <Tables
          tableColumn={columns}
          tableData={data?.length ? data : []}
          customHooks={[tableHooks]}
        />
      ) : (
        <FormError>Cant Fetch Publications</FormError>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <Button
          style={{
            opacity: !nextUrl ? "0.5" : "1",
          }}
          disabled={!nextUrl}
          onClick={() => setUrl(nextUrl!)}
        >
          Load More
        </Button>
      </div>
    </>
  );
};

export default PublicationTables;
