import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import OffCanvas from "../OffCanvas/OffCanvas";

import { useMediaQuery } from "react-responsive";
import { Form } from "../../globals/styles/forms.styles";
import InputWithLabel from "../InputWithLabel/InputWithLabel";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TableReject, TableView } from "../Tables/Tables.styles";
import { Hooks } from "react-table";
import Tables from "../Tables/Tables";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createHomeSliderApi,
  deleteHomeSliderApi,
  editHomeSliderApi,
  getHomeSliderApi,
} from "../../axios/api-calls";

const HomePageSlider = () => {
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [currentData, setCurrentData] = useState<createSliderschemaType>();
  const { isLoading, data } = useQuery("getHomeSliderApi", getHomeSliderApi);
  console.log({ data });

  const { mutate: deleteFunc, isLoading: deleteting } = useMutation(
    deleteHomeSliderApi,
    {
      onSuccess: (d) => {
        queryClient.invalidateQueries("getHomeSliderApi");
        toast.success("Deleted!", {
          progressClassName: "toastProgress",
          icon: false,
        });
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
      <Loading loading={isLoading || deleteting} />
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
        {currentData ? <CreateSlider sliderInstance={currentData} /> : ""}
      </OffCanvas>

      <Button styleType={"sec"} onClick={() => setIsOpen(true)}>
        Create
      </Button>
      {/* table goes here */}

      <Tables
        tableColumn={columns}
        tableData={data ? data : []}
        customHooks={[tableHooks]}
      />
    </div>
  );
};

export default HomePageSlider;

const createSliderschema = yup.object({
  title: yup.string().required(),
  banner: yup.mixed(),
  content: yup.string().required(),
  id: yup.number(),
  order_position: yup.number().positive().integer(),
});

export type createSliderschemaType = yup.InferType<typeof createSliderschema>;
const CreateSlider = ({
  sliderInstance,
}: {
  sliderInstance?: createSliderschemaType;
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<createSliderschemaType>({
    resolver: yupResolver(createSliderschema),
  });

  const { mutate, isLoading } = useMutation(createHomeSliderApi, {
    onSuccess: (d) => {
      queryClient.invalidateQueries("getHomeSliderApi");
      toast.success("Created Slider!", {
        progressClassName: "toastProgress",
        icon: false,
      });
    },
  });
  const { mutate: update, isLoading: updateting } = useMutation(
    editHomeSliderApi,
    {
      onSuccess: (d) => {
        queryClient.invalidateQueries("getHomeSliderApi");
        toast.success("UpdatedSlider!", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
    }
  );

  const onSubmitHandler = (data: createSliderschemaType) => {
    if (sliderInstance) {
      update({ ...data, banner: data.banner ? data.banner[0] : undefined });
    } else {
      mutate({ ...data, banner: data.banner[0] });
    }
  };

  // useEffect(() => {
  //   if (sliderInstance) {
  //     // setValue('banner',sliderInstance.banner)
  //     setValue("content", sliderInstance.content);
  //     setValue("title", sliderInstance.title);
  //     setValue("id", sliderInstance.id);
  //   }
  // }, []);

  useEffect(() => {
    if (sliderInstance) {
      setValue("content", sliderInstance.content);
      setValue("title", sliderInstance.title);
      setValue("id", sliderInstance.id);
      setValue("order_position", sliderInstance.order_position);
    }
  }, [sliderInstance, setValue]);

  return (
    <Form onSubmit={handleSubmit(onSubmitHandler)}>
      <Loading loading={isLoading || updateting} />
      <h2 style={{ padding: "1rem 0" }}>Create Slider</h2>
      <br />
      <br />
      <InputWithLabel
        label="Title"
        register={register("title")}
        errorMessage={errors.title?.message}
      />

      <InputWithLabel
        label="Display Order"
        type="number"
        placeholder="Lower numbers appear first."
        register={register("order_position")}
        errorMessage={errors.order_position?.message}
      />

      <InputWithLabel
        isTextArea={true}
        label="Content"
        errorMessage={errors.content?.message}
        register={register("content")}
      />

      <InputWithLabel
        // errorMessage={errors.banner?.message}
        type="file"
        label="Banner"
        register={register("banner")}
      />

      <Button styleType="whiteBg">
        {sliderInstance ? "Update" : "Create"}
      </Button>
    </Form>
  );
};
