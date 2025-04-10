import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useMediaQuery } from "react-responsive";
import OffCanvas from "../../components/OffCanvas/OffCanvas";
import Button from "../../components/Button/Button";
import { MrcModal, MrcUpdateModal } from "../../components/Modals/MrcModal";
import Tables from "../../components/Tables/Tables";
import { Hooks } from "react-table";
import {
  createUpdateSectoralGroupApi,
  deleteMpdclApi,
  deleteMrcApi,
  deleteSectoralGroupApi,
  getMPDCLPageContentApi,
  getMpdclApi,
  getMrcApi,
  getMrcPage,
  getSectoralGroupApi,
  updateMPDCLPageContentApi,
  updateMrcPageApi,
} from "../../axios/api-calls";
import Loading from "../../components/Loading/Loading";
import { TableReject, TableView } from "../../components/Tables/Tables.styles";
import InputWithLabel from "../../components/InputWithLabel/InputWithLabel";
import MPDCLModal, {
  MPDCLModalUpdate,
} from "../../components/Modals/MPDCLModal";
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BoxWithHeading from "../../components/BoxWithHeading";
import { AddMoreButton } from "../../globals/styles/CustomFormComponents";
import CreateSectoralGroupModal, {
  SectoralGroupTabSchemaType,
  UpdateGroupModal,
} from "../../components/Modals/SectoralGroupModal";
import { useAuthStore } from "../../zustand/store";
import { Navigate } from "react-router-dom";
import AdvancedEditor from "../../components/TextEditor/AdvancedQuill";
import SectoralGroupTab from "./_components/SectorialGroupTab";
import MPDCLPageContent from "./_components/MDPCLPageContent";

const StructurePage = () => {
  const [options, setOptions] = useState("MPDCL");
  const userData = useAuthStore.getState().user;

  if (!["super_user", "public_view"].includes(String(userData?.user_type))) {
    return <Navigate to="/unauthorized" />;
  }

  useEffect(() => {}, []);
  return (
    <div>
      <div
        style={{
          padding: "10px 5px",
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          margin: "20px 0",
          // width: "100%",
        }}
      >
        <span
          style={{
            fontWeight: "500",
            color: `${options === "MPDCL" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("MPDCL")}
        >
          MPDCL
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "MPDCLPageContent" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("MPDCLPageContent")}
        >
          MPDCLPageContent
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "mrc" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("mrc")}
        >
          MRC Services
          {/* Sectoral Group Page */}
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "MRCpagecontent" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("MRCpagecontent")}
        >
          MRC page content
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "SectoralGroup" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("SectoralGroup")}
        >
          Sectoral Group
        </span>

        <br />
        <br />
      </div>
      {options === "MPDCL" ? <MPDCL /> : null}
      {options === "MPDCLPageContent" ? <MPDCLPageContent /> : null}

      {options === "mrc" ? <MrcTab /> : null}
      {options === "SectoralGroup" ? <SectoralGroupTab /> : null}
      {options === "MRCpagecontent" ? <MrcPageContentTab /> : null}
    </div>
  );
};

export default StructurePage;

const MrcTab = () => {
  const queryClient = useQueryClient();
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });
  const [currentData, setCurrentData] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenupdate, setIsOpenUpdate] = useState(false);
  const { isLoading, data } = useQuery("mrc-list", getMrcApi);
  const { isLoading: deleting, mutate: deleteFunc } = useMutation(
    deleteMrcApi,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("mrc-list");
      },
    }
  );
  const columns = [
    {
      Headers: "name",
      accessor: "name",
      id: 3,
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
        id: "name",
        Header: "Name",
        Cell: (tableProp: any) => <>{tableProp.row.original.name}</>,
      },
      {
        id: "Description",
        Header: "Description",
        Cell: (tableProp: any) => (
          <>{tableProp.row.original.description.slice(0, 100)}...</>
        ),
      },
      {
        id: "Small Text",
        Header: "small_text",
        Cell: (tableProp: any) => <>{tableProp.row.original.small_text}</>,
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
        <MrcModal />
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpenUpdate}
        isOpen={isOpenupdate}
      >
        <MrcUpdateModal mrc={currentData} />
      </OffCanvas>

      <Button styleType={"sec"} onClick={() => setIsOpen(true)}>
        Create Service
      </Button>

      <br />

      <Tables
        tableColumn={columns}
        tableData={data ? data : []}
        customHooks={[tableHooks]}
      />
    </div>
  );
};

const MrcPageContentTabschema = yup.object({
  objectives_card: yup.array().of(
    yup.object({
      header: yup.string().required(),
      description: yup.string().required(),
    })
  ),
  who_we_are: yup.string().required(),
  objectives: yup.string().required(),
});
export type MrcPageContentTabschemaType = yup.InferType<
  typeof MrcPageContentTabschema
>;
const MrcPageContentTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  const [whoWeAre, setWhoWeAre] = useState("");
  const [objectives, setObjectives] = useState("");
  const [currentData, setCurrentData] = useState<any>();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MrcPageContentTabschemaType>({
    resolver: yupResolver(MrcPageContentTabschema),
  });

  const {
    fields: objectivesCardField,
    append,
    remove,
  } = useFieldArray({
    name: "objectives_card",
    control,
  });

  const { isLoading } = useQuery("mrc-page", getMrcPage, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (data) {
        console.log(data);
        setValue("objectives_card", data.objectives_card);
        setValue("who_we_are", data?.who_we_are);
        setValue("objectives", data?.objectives);

        setWhoWeAre(data?.who_we_are);
        setObjectives(data?.objectives);
      }
    },
  });
  const { mutate, isLoading: editing } = useMutation(updateMrcPageApi, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("mrc-page");
      toast.success("Update Success", {
        progressClassName: "toastProgress",
        icon: false,
      });
    },
  });
  //

  const onSubmitHandler = (data: MrcPageContentTabschemaType) => {
    console.log({ SUbmittedData: data });

    mutate(data);
  };

  return (
    <div>
      {/* <Loading loading={isLoading||deleting} /> */}

      <Loading loading={isLoading || editing} />
      <h2>MRC page content</h2>

      {/* Objectives */}
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        {/* objectives_ca */}
        <BoxWithHeading heading="Objectives Card">
          <br />
          {objectivesCardField.map((d, index) => (
            <>
              <InputWithLabel
                //  register={}
                label="Card header"
                register={register(`objectives_card.${index}.header`)}
              />
              <InputWithLabel
                //  register={}
                label="Description"
                register={register(`objectives_card.${index}.description`)}
              />
              <Button
                styleType={"whiteBg"}
                onClick={() => {
                  remove(index);
                }}
              >
                DELETE
              </Button>
              <br />
            </>
          ))}
          <AddMoreButton
            justify="center"
            click={() => {
              append({ description: "", header: "heading" });
            }}
          >
            Add More
          </AddMoreButton>
        </BoxWithHeading>

        <BoxWithHeading heading="Who We Are">
          <AdvancedEditor
            value={whoWeAre}
            onChange={(val: string) => {
              setWhoWeAre(val);
              setValue("who_we_are", val, { shouldValidate: true });
            }}
          />
        </BoxWithHeading>

        <BoxWithHeading heading="Objectives">
          <AdvancedEditor
            onlyList
            value={objectives}
            onChange={(val: string) => {
              setObjectives(val);
              setValue("objectives", val, { shouldValidate: true });
            }}
          />
        </BoxWithHeading>
        <Button style={{ width: "100%", marginTop: "2rem" }} styleType="pry">
          EDIT
        </Button>
      </form>
    </div>
  );
};

const MPDCL = () => {
  const queryClient = useQueryClient();
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });
  const [currentData, setCurrentData] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenupdate, setIsOpenUpdate] = useState(false);
  const { isLoading, data } = useQuery("mpdcl-list", getMpdclApi);
  const { isLoading: deleteing, mutate: deleteFunc } = useMutation(
    deleteMpdclApi,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("mpdcl-list");
        toast.success("MPDCL Deleted", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
    }
  );
  // const  {isLoading:deleting,mutate:deleteFunc} = useMutation(deleteMrcApi,{
  //   'onSuccess':()=>{
  //     queryClient.invalidateQueries('mrc-list')
  //   }
  // })
  const columns_mpdcl = [
    {
      Header: "Type",
      accessor: "type",
      id: 3,
    },
    {
      Header: "Header",
      accessor: "header",
      id: 1,
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
      {
        Header: "Description",
        accessor: "description",
        Cell: (tableProps: any) => {
          return <>{tableProps.row.description?.slice(0, 50)}...</>;
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
      <Loading loading={isLoading || deleteing} />
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        <MPDCLModal />
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpenUpdate}
        isOpen={isOpenupdate}
      >
        {currentData ? <MPDCLModalUpdate previous_data={currentData} /> : ""}
      </OffCanvas>

      <Button styleType={"sec"} onClick={() => setIsOpen(true)}>
        Create MPDCL
      </Button>

      <br />

      <Tables
        tableColumn={columns_mpdcl}
        tableData={
          data ? data : []
          // []
        }
        customHooks={[tableHooks]}
      />
    </div>
  );
};

// const SectoralGroupTab = () => {
//   const isMobileScreen = useMediaQuery({ maxWidth: 600 });
//   const queryClient = useQueryClient();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isUpdateOpen, setIsUpdateOpen] = useState(false);
//   const [currentData, setCurrentData] = useState<SectoralGroupTabSchemaType>();
//   const { isLoading, data } = useQuery("get-sectoral", getSectoralGroupApi, {
//     // 'onSuccess':(data)=>{

//     // }
//     refetchOnWindowFocus: false,
//   });
//   console.log(data);

//   const { isLoading: deleting, mutate: deleteSectoralGroup } = useMutation(
//     deleteSectoralGroupApi,
//     {
//       onSuccess: (data) => {
//         toast.error(`Deleted Sectoral Group`, {
//           progressClassName: "toastProgress",
//           icon: false,
//         });
//         queryClient.invalidateQueries("get-sectoral");
//       },
//     }
//   );

//   // createUpdateSectoralGroupApi

//   const columns = [
//     {
//       Header: "Header",
//       accessor: "header",
//     },
//   ];
//   const tableHooks = (hooks: Hooks) => {
//     hooks.visibleColumns.push((columns) => [
//       {
//         id: "s/n",
//         Header: "S/N",
//         Cell: (tableProps: any) => {
//           return <>{tableProps.row.index + 1}</>;
//         },
//       },
//       ...columns,
//       {
//         id: "images",
//         Header: "Image",
//         Cell: (tableProp: any) => (
//           <>
//             <img
//               style={{ width: "50px", height: "50px" }}
//               src={tableProp.row.original.image}
//             />
//           </>
//         ),
//       },
//       {
//         id: "Click to Edit",
//         Header: "Click to Edit",
//         Cell: ({ row }: any) => (
//           <TableView
//             onClick={() => {
//               setIsUpdateOpen(true);
//               setCurrentData(row.original);
//             }}
//           >
//             Edit
//           </TableView>
//         ),
//       },
//       {
//         id: "Click to Delete",
//         Header: "Click to Delete",
//         Cell: ({ row }: any) => (
//           <TableReject
//             onClick={() => {
//               if (row.original?.id) {
//                 deleteSectoralGroup(row.original.id);
//               }
//             }}
//           >
//             Delete
//           </TableReject>
//         ),
//       },
//     ]);
//   };
//   return (
//     <div>
//       <OffCanvas
//         size={isMobileScreen ? 100 : 50}
//         btnClick={() => null}
//         setIsOpen={setIsOpen}
//         isOpen={isOpen}
//       >
//         <CreateSectoralGroupModal />
//       </OffCanvas>

//       <OffCanvas
//         size={isMobileScreen ? 100 : 50}
//         btnClick={() => null}
//         setIsOpen={setIsUpdateOpen}
//         isOpen={isUpdateOpen}
//       >
//         <UpdateGroupModal data={currentData} />
//       </OffCanvas>

//       {/* <p>jdjd</p> */}
//       <Button styleType={"sec"} onClick={() => setIsOpen(true)}>
//         Create Sectoral Group
//       </Button>
//       <Loading loading={isLoading || deleting} />

//       <Tables
//         tableColumn={columns}
//         tableData={data ? data : []}
//         customHooks={[tableHooks]}
//       />
//     </div>
//   );
// };
