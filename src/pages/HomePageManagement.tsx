import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useMediaQuery } from "react-responsive";
import OffCanvas from "../components/OffCanvas/OffCanvas";
import Button from "../components/Button/Button";
import Tables from "../components/Tables/Tables";
import {
  UpdateWhyChooseUsModal,
  WhyChooseUsModal,
} from "../components/Modals/HomePageManagement/WhyChooseUse";
import { Hooks } from "react-table";
import { TableReject, TableView } from "../components/Tables/Tables.styles";
import {
  deleteWhyChooseUsApi,
  getHomePageContent,
  getWhyChooseUsApi,
  updateHomePageContent,
} from "../axios/api-calls";
import Loading from "../components/Loading/Loading";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputWithLabel from "../components/InputWithLabel/InputWithLabel";
import BoxWithHeading from "../components/BoxWithHeading";
import { AddMoreButton } from "../globals/styles/CustomFormComponents";
import { useForm, useFieldArray } from "react-hook-form";
import { useAuthStore } from "../zustand/store";
import { Navigate } from "react-router-dom";
import AdvertSection from "../components/AdvertSection/AdvertSection";

const HomePageManagement = () => {
  const [options, setOptions] = useState<string>("WhyWeareUnique");
  const userData = useAuthStore.getState().user;

  if (!["super_user", "public_view"].includes(String(userData?.user_type))) {
    return <Navigate to="/unauthorized" />;
  }
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
            color: `${options === "WhyWeareUnique" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("WhyWeareUnique")}
        >
          Why We are Unique
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "HomePageContent" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("HomePageContent")}
        >
          HomePage Content
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "Advertisements" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 160px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("Advertisements")}
        >
          Advertisements
        </span>
      </div>

      {options === "WhyWeareUnique" && <WhyWeAreUnique />}
      {options === "HomePageContent" && <HomePageContent />}
      {options === "Advertisements" && <AdvertSection />}
    </div>
  );
};

export default HomePageManagement;

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

const HomePageContentSchema = yup.object({
  slider_welcome_message: yup.string().required(),
  slider_vision_message: yup.string().required(),
  slider_mission_message: yup.string().required(),

  vision_intro: yup.array().of(yup.object({ value: yup.string() })),
  mission_intro: yup.array().of(yup.object({ value: yup.string() })),
  advocacy_intro: yup.array().of(yup.object({ value: yup.string() })),

  history_intro: yup.array().of(yup.object({ value: yup.string() })),
  why_join_intro: yup.array().of(yup.object({ value: yup.string() })),
  members_intro: yup.array().of(yup.object({ value: yup.string() })),

  Logo: yup.mixed(),
  slider_image1: yup.mixed(),
  slider_image2: yup.mixed(),
  slider_image3: yup.mixed(),
});
export type HomePageContentType = yup.InferType<typeof HomePageContentSchema>;
const HomePageContent = () => {
  const { isLoading, data } = useQuery(
    "getHomePageContent",
    getHomePageContent,
    {
      onSuccess: (data) => {
        if (data) {
          console.log({ data });
        }
      },
    }
  );
  const client = useQueryClient();
  const { isLoading: updateing, mutate } = useMutation(updateHomePageContent, {
    onSuccess: (data) => {
      toast.success("home page content saved", {
        progressClassName: "toastProgress",
        icon: false,
      });
      client.invalidateQueries("getHomePageContent");
    },
    onError: (error) => {
      toast.error("ome page content not edited", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HomePageContentType>({
    resolver: yupResolver(HomePageContentSchema),
  });
  const {
    fields: VisionCardField,
    append: VisionCardappend,
    remove: VisionCardremove,
  } = useFieldArray({
    name: "vision_intro",
    control,
  });
  const {
    fields: MissionCardField,
    append: MissionCardappend,
    remove: MissionCardremove,
  } = useFieldArray({
    name: "mission_intro",
    control,
  });
  const {
    fields: AdvocacyCardField,
    append: AdvocacyCardappend,
    remove: AdvocacyCardremove,
  } = useFieldArray({
    name: "advocacy_intro",
    control,
  });
  const {
    fields: HistoryCardField,
    append: HistoryCardappend,
    remove: HistoryCardremove,
  } = useFieldArray({
    name: "history_intro",
    control,
  });

  const {
    fields: whyJoinIntroCardField,
    append: whyJoinIntroCardappend,
    remove: whyJoinIntroCardremove,
  } = useFieldArray({
    name: "why_join_intro",
    control,
  });
  const {
    fields: membersIntroCardField,
    append: membersIntroCardappend,
    remove: membersIntroCardremove,
  } = useFieldArray({
    name: "members_intro",
    control,
  });
  const onSubmitHandler = (data: HomePageContentType) => {
    console.log({ SUbmittedData: data });
    mutate(data);
  };

  useEffect(() => {
    if (data) {
      setValue("Logo", data.Logo);
      setValue("slider_image1", data.slider_image1);
      setValue("slider_image2", data.slider_image2);
      setValue("slider_image3", data.slider_image3);

      setValue("slider_welcome_message", data.slider_welcome_message);
      setValue("slider_vision_message", data.slider_vision_message);
      setValue("slider_mission_message", data.slider_mission_message);

      setValue(
        "vision_intro",
        data.mission_intro.map((d) => ({ value: d }))
      );
      setValue(
        "mission_intro",
        data.mission_intro.map((d) => ({ value: d }))
      );
      setValue(
        "advocacy_intro",
        data.advocacy_intro.map((d) => ({ value: d }))
      );
      setValue(
        "history_intro",
        data.history_intro.map((d) => ({ value: d }))
      );
      setValue(
        "why_join_intro",
        data.why_join_intro.map((d) => ({ value: d }))
      );
      setValue(
        "members_intro",
        data.members_intro.map((d) => ({ value: d }))
      );
    }
  }, [data]);
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Loading loading={isLoading || updateing} />
      <h2>Home Page Content</h2>
      <InputWithLabel
        label="Slider Welcome Message"
        register={register("slider_welcome_message")}
      />

      <InputWithLabel
        label="Slider Vision Message"
        register={register("slider_vision_message")}
      />

      <InputWithLabel
        label="Slider Mission Message"
        register={register("slider_mission_message")}
      />
      <BoxWithHeading heading="Vision Intro">
        {VisionCardField.map((field, index: number) => (
          <>
            <br />
            <InputWithLabel
              label=""
              register={register(`vision_intro.${index}.value`)}
            />
            <Button
              styleType={"whiteBg"}
              onClick={() => {
                VisionCardremove(index);
              }}
            >
              DELETE
            </Button>
            <br />
          </>
        ))}
      </BoxWithHeading>

      <AddMoreButton
        justify="center"
        click={() => {
          VisionCardappend({ value: "" });
        }}
      >
        Add More
      </AddMoreButton>

      <BoxWithHeading heading="Mission Intro">
        {MissionCardField.map((field, index) => (
          <>
            <br />
            <InputWithLabel
              register={register(`mission_intro.${index}.value`)}
              label=""
            />
            <Button
              styleType={"whiteBg"}
              onClick={() => {
                MissionCardremove(index);
              }}
            >
              DELETE
            </Button>
            <br />
          </>
        ))}
      </BoxWithHeading>

      <AddMoreButton
        justify="center"
        click={() => {
          MissionCardappend({ value: "" });
        }}
      >
        Add More
      </AddMoreButton>

      <BoxWithHeading heading="Advocacy Intro">
        {AdvocacyCardField.map((field, index) => (
          <>
            <br />
            <InputWithLabel
              register={register(`advocacy_intro.${index}.value`)}
              label=""
            />
            <Button
              styleType={"whiteBg"}
              onClick={() => {
                AdvocacyCardremove(index);
              }}
            >
              DELETE
            </Button>
            <br />
          </>
        ))}
      </BoxWithHeading>
      <AddMoreButton
        justify="center"
        click={() => {
          AdvocacyCardappend({ value: "" });
        }}
      >
        Add More
      </AddMoreButton>

      <BoxWithHeading heading="History Intro">
        {HistoryCardField.map((field, index) => (
          <>
            <br />
            <InputWithLabel
              label=""
              register={register(`history_intro.${index}.value`)}
            />
            <Button
              styleType={"whiteBg"}
              onClick={() => {
                HistoryCardremove(index);
              }}
            >
              DELETE
            </Button>
            <br />
          </>
        ))}
      </BoxWithHeading>
      <AddMoreButton
        justify="center"
        click={() => {
          HistoryCardappend({ value: "" });
        }}
      >
        Add More
      </AddMoreButton>

      <BoxWithHeading heading="Why Join Intro">
        {whyJoinIntroCardField.map((field, index) => (
          <>
            <br />
            <InputWithLabel
              register={register(`why_join_intro.${index}.value`)}
              label=""
            />
            <Button
              styleType={"whiteBg"}
              onClick={() => {
                whyJoinIntroCardremove(index);
              }}
            >
              DELETE
            </Button>
            <br />
          </>
        ))}
      </BoxWithHeading>
      <AddMoreButton
        justify="center"
        click={() => {
          whyJoinIntroCardappend({ value: "" });
        }}
      >
        Add More
      </AddMoreButton>

      <BoxWithHeading heading="Members Intro">
        {membersIntroCardField.map((field, index) => (
          <>
            <br />
            <InputWithLabel
              register={register(`members_intro.${index}.value`)}
              label=""
            />
            <Button
              styleType={"whiteBg"}
              onClick={() => {
                membersIntroCardremove(index);
              }}
            >
              DELETE
            </Button>
            <br />
          </>
        ))}
      </BoxWithHeading>
      <AddMoreButton
        justify="center"
        click={() => {
          membersIntroCardappend({ value: "" });
        }}
      >
        Add More
      </AddMoreButton>

      <div style={{ margin: "0 10px" }}>
        <img
          src={data?.Logo}
          style={{ width: "75px", height: "75px" }}
          alt=""
        />
        <InputWithLabel register={register("Logo")} label="Logo" />
      </div>

      <div style={{ margin: "0 10px" }}>
        <img
          src={data?.slider_image1 ?? ""}
          style={{ width: "75px", height: "75px" }}
          alt=""
        />
        <InputWithLabel
          register={register("slider_image1")}
          label="slider image"
          type="file"
        />
      </div>

      <div style={{ margin: "0 10px" }}>
        <img
          src={data?.slider_image2 ?? ""}
          style={{ width: "75px", height: "75px" }}
          alt=""
        />
        <InputWithLabel
          register={register("slider_image2")}
          label="our vision image"
          type="file"
        />
      </div>

      <div style={{ margin: "0 10px" }}>
        <img
          src={data?.slider_image3 ?? ""}
          style={{ width: "75px", height: "75px" }}
          alt=""
        />
        <InputWithLabel
          register={register("slider_image3")}
          label="lastest update image"
          type="file"
        />
      </div>

      <Button style={{ width: "100%" }} styleType="pry">
        EDIT
      </Button>
    </form>
  );
};
