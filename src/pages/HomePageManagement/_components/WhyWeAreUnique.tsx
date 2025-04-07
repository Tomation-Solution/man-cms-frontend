import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useMediaQuery } from "react-responsive";
import OffCanvas from "../../../components/OffCanvas/OffCanvas";
import Button from "../../../components/Button/Button";
import Tables from "../../../components/Tables/Tables";
import {
  UpdateWhyChooseUsModal,
  WhyChooseUsModal,
} from "../../../components/Modals/HomePageManagement/WhyChooseUse";
import { Hooks } from "react-table";
import {
  TableReject,
  TableView,
} from "../../../components/Tables/Tables.styles";
import {
  deleteWhyChooseUsApi,
  getWhyChooseUsApi,
} from "../../../axios/api-calls";
import Loading from "../../../components/Loading/Loading";
import { toast } from "react-toastify";

const WhyWeAreUnique = () => {
  const queryClient = useQueryClient();
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });
  const [currentData, setCurrentData] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenupdate, setIsOpenUpdate] = useState(false);
  const { isLoading, data } = useQuery("whychooseus", getWhyChooseUsApi);
  const { isLoading: deleting, mutate: deleteFunc } = useMutation(
    deleteWhyChooseUsApi,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("whychooseus");
        toast.success("Deleted", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
    }
  );

  const columns = [
    {
      Header: "Header",
      accessor: "heading",
      id: 1,
    },

    {
      Header: "Description",
      accessor: "description",
      id: 2,
    },
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
              src={tableProp.row.original.image}
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
        Cell: ({ row }: any) => (
          <TableReject
            onClick={() => {
              if (row.original?.id) {
                deleteFunc(row.original.id);
              }
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
      <Loading loading={isLoading || deleting} />
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        <WhyChooseUsModal />
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpenUpdate}
        isOpen={isOpenupdate}
      >
        {currentData ? <UpdateWhyChooseUsModal data={currentData} /> : ""}
      </OffCanvas>
      <Button styleType={"sec"} onClick={() => setIsOpen(true)}>
        Create
      </Button>

      <Tables
        tableColumn={columns}
        tableData={
          data ? data : []
          // []
        }
        customHooks={[tableHooks]}
      />
    </div>
  );
};

export default WhyWeAreUnique;
