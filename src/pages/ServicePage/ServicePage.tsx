import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import OffCanvas from "../../components/OffCanvas/OffCanvas";
import CreateNewsModal from "../../components/Modals/NewsModal/CreateNewsModal";
import Button from "../../components/Button/Button";
import ServicePageModals, {
  ServicePageModalsUpdate,
} from "../../components/Modals/ServicePageModals/ServicePageModals";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteServiceApi, getServices } from "../../axios/api-calls";
import Tables from "../../components/Tables/Tables";
import { datefromatter } from "../../utils/DateFormatter";
import { Hooks } from "react-table";
import Loading from "../../components/Loading/Loading";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../zustand/store";
import { toast } from "react-toastify";
import { TableReject, TableView } from "../../components/Tables/Tables.styles";
import ServiceUpdateBanner from "../../components/Modals/ServicePageModals/Updatebanner";

const ServicePage = (): React.ReactElement => {
  const userData = useAuthStore.getState().user;
  const queryClient = useQueryClient();
  const [currentData, setCurrentData] = useState();
  const [isBannerOpen, setIsBannerOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  const [data, setData] = useState<any>([]);
  const [nextUrl, setNextUrl] = useState("");
  const [updateNext, setUpdateNext] = useState(true);

  const [url, setUrl] = useState("/services/all-services");
  const { isLoading, data: results } = useQuery(["services-list", url], () =>
    getServices(url)
  );
  const { isLoading: deleting, mutate: deleteFunc } = useMutation(
    deleteServiceApi,
    {
      onSuccess: () => {
        toast.error("Deleted", {
          icon: false,
          progressClassName: "toastProgress",
        });
        queryClient.invalidateQueries("services-list");
      },
    }
  );
  // const {}=useMutation
  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },

    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Type",
      accessor: "type",
    },
  ];

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
    }
  }, [results, updateNext]);

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
        id: "Image",
        Header: "Image",
        Cell: (tableProp: any) => {
          return (
            <>
              <img
                src={tableProp.row.original.image}
                style={{ width: "50px", height: "50px", borderRadius: "10pxz" }}
                alt=""
              />
            </>
          );
        },
      },
      {
        id: "CreatedAt",
        Header: "CreatedAt",
        Cell: (tableProp: any) => (
          <>{datefromatter(new Date(tableProp.row.original.created_at))}</>
        ),
      },
      {
        id: "UpdatedAt",
        Header: "UpdatedAt",
        Cell: (tableProp: any) => (
          <>{datefromatter(new Date(tableProp.row.original.updated_at))}</>
        ),
      },
      {
        id: "Delete",
        Header: "Delete",
        Cell: (tableProp: any) => (
          <TableReject
            onClick={() => {
              deleteFunc(tableProp.row.original.id);
            }}
          >
            Delete
          </TableReject>
          // <Button
          //   styleType={"whiteBg"}
          //   onClick={() => {
          //     deleteFunc(tableProp.row.original.id);
          //   }}
          // >
          //   DELETE
          // </Button>
        ),
      },
      {
        id: "Update",
        Header: "Update",
        Cell: (tableProp: any) => (
          <TableView
            onClick={() => {
              setIsOpenUpdate(true);
              console.log(tableProp.row.original);
              setCurrentData(tableProp.row.original);
            }}
          >
            Edit
          </TableView>
        ),
      },
    ]);
  };

  if (!["super_user", "public_view"].includes(String(userData?.user_type))) {
    return <Navigate to="/unauthorized" />;
  }
  return (
    <div>
      <Loading loading={deleting} />
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        {/* <CreateNewsModal closefn={() => setIsOpen(!isOpen)} /> */}
        <ServicePageModals />
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpenUpdate}
        isOpen={isOpenUpdate}
      >
        {currentData ? <ServicePageModalsUpdate data={currentData} /> : ""}
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsBannerOpen}
        isOpen={isBannerOpen}
      >
        <ServiceUpdateBanner closefn={() => setIsBannerOpen(!isBannerOpen)} />
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
          Create Service
        </Button>

        <Button styleType={"sec"} onClick={() => setIsBannerOpen(true)}>
          Update Page Content
        </Button>
      </div>

      <br />
      <Tables
        tableColumn={columns}
        tableData={data ? data : []}
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

export default ServicePage;
