import { Hooks } from "react-table";
import { TableReject, TableView } from "../Tables/Tables.styles";
import Button from "../Button/Button";
import Tables from "../Tables/Tables";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteExecutiveApi, getExecutiveApi } from "../../axios/api-calls";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import OffCanvas from "../OffCanvas/OffCanvas";
import CreateOurExcutiveModal, {
  DeleteExecutiveModal,
  UpdateOurExcutiveModal,
} from "../Modals/OurExcutive";
import Loading from "../Loading/Loading";

const OurExcutive = () => {
  const queryClient = useQueryClient();
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });
  const [currentData, setCurrentData] = useState<any>();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenupdate, setIsOpenUpdate] = useState(false);
  const [url, setUrl] = useState("aboutus/our-executives");

  const [data, setData] = useState<any>([]);
  const [nextUrl, setNextUrl] = useState("");
  const [updateNext, setUpdateNext] = useState(true);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [delId, setDelId] = useState(0);
  const [delName, setDelName] = useState("");
  const closeDeleteSlider = () => {
    setIsDeleteOpen(!isDeleteOpen);
  };

  const { isLoading, data: results } = useQuery(["getExecutiveApi", url], () =>
    getExecutiveApi(url)
  );

  useEffect(() => {
    if (results?.results) {
      setData((prevData: any[]) => {
        const existingIds = new Set(prevData.map((item) => item.id));
        const newData = results.results.data.filter(
          (item: any) => !existingIds.has(item.id)
        ); // Filter out duplicates

        const mergedData = [...prevData, ...newData]; // Append only new unique items
        return mergedData;
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

  const columnsExcutive = [
    {
      Header: "Name",
      accessor: "name",
      id: 1,
    },
    {
      Header: "Title",
      accessor: "title",
      id: 2,
    },
    {
      Header: "Type",
      accessor: "type",
      id: 3,
    },
    {
      Header: "Display Order",
      accessor: "order_position",
      id: 4,
    },
    //   {
    //     Header:'Extra Title One',
    //     accessor:'extra_title1',
    //     id:4
    // },
    //   {
    //     Header:'Extra Title Two',
    //     accessor:'extra_title2',
    //     id:5
    // },
    //   {
    //     Headers:'image',
    //     accessor:'image',
    //   },
  ];

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      {
        id: "s/n",
        Header: "S/N",
        Cell: (tableProps: any) => {
          return <>{tableProps.row.index + 1}</>;
        },
      },
      ...columns,
      {
        id: "images",
        Header: "Image",
        Cell: (tableProp: any) => (
          <>
            <img
              style={{ width: "50px", height: "50px" }}
              src={
                tableProp.row.original.image ? tableProp.row.original.image : ""
              }
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
              // setId(row.values.id);
              setIsOpenUpdate(true);
              setCurrentData(row.original);
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
    <div>
      <Loading loading={isLoading} />
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        <CreateOurExcutiveModal />
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpenUpdate}
        isOpen={isOpenupdate}
      >
        <UpdateOurExcutiveModal data={currentData} />
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsDeleteOpen}
        isOpen={isDeleteOpen}
      >
        <DeleteExecutiveModal
          execId={delId}
          closefn={closeDeleteSlider}
          execName={delName}
        />
      </OffCanvas>

      {/*  */}
      {/*  */}

      <Button
        styleType={"sec"}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Create EXECUTIVE
      </Button>

      <Tables
        tableColumn={columnsExcutive}
        tableData={
          data ? data : []
          // []
        }
        customHooks={[tableHooks]}
      />

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
    </div>
  );
};

export default OurExcutive;
