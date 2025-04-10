import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputWithLabel from "../../components/InputWithLabel/InputWithLabel";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useMediaQuery } from "react-responsive";
import Button from "../../components/Button/Button";
import { createUpdateSectoralGroupApi } from "../../axios/api-calls";
import AdvancedEditor from "../TextEditor/AdvancedQuill";

const SectoralGroupTabSchema = yup.object({
  header: yup.string().required(),
  description: yup.string().required(),
  image: yup.mixed(),
  id: yup.number(),
});
export type SectoralGroupTabSchemaType = yup.InferType<
  typeof SectoralGroupTabSchema
>;

// data:SectoralGroupTabSchemaType
const CreateSectoralGroupModal = () => {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SectoralGroupTabSchemaType>({
    resolver: yupResolver(SectoralGroupTabSchema),
  });

  const { isLoading: creating, mutate } = useMutation(
    createUpdateSectoralGroupApi,
    {
      onSuccess: (data) => {
        reset();
        queryClient.invalidateQueries("get-sectoral");
        toast.success(`Created Sectoral Group`, {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
    }
  );

  const onSubmitHandler = (data: SectoralGroupTabSchemaType) => {
    console.log({ SUbmittedData: data });
    mutate(data);
  };

  if (creating) return <Loading loading={creating} />;

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <h2 style={{ padding: "1rem 0" }}>Sectoral Group</h2>

      <InputWithLabel label="header" register={register("header")} />
      <br />
      <AdvancedEditor
        value={description}
        onChange={(val: string) => {
          setDescription(val);
          setValue("description", val, { shouldValidate: true });
        }}
      />
      <br />
      <InputWithLabel label="Image" type="file" register={register("image")} />
      <br />
      <Button styleType="whiteBg" style={{ width: "100%" }}>
        Create
      </Button>
    </form>
  );
};

export default CreateSectoralGroupModal;

export const UpdateGroupModal = ({
  data,
}: {
  data?: SectoralGroupTabSchemaType;
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SectoralGroupTabSchemaType>({
    resolver: yupResolver(SectoralGroupTabSchema),
  });
  const [description, setDescription] = useState("");
  const { isLoading: creating, mutate } = useMutation(
    createUpdateSectoralGroupApi,
    {
      onSuccess: (data) => {
        reset;
        queryClient.invalidateQueries("get-sectoral");
        toast.success(`Updated Sectoral Group`, {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
    }
  );

  const onSubmitHandler = (data: SectoralGroupTabSchemaType) => {
    console.log({ SUbmittedData: data });
    mutate(data);
  };

  useEffect(() => {
    if (data) {
      setValue("header", data.header);
      setValue("description", data.description);
      setValue("id", data.id);
      setValue("image", data.image);
      setDescription(data.description);
    }
  }, [data]);
  if (creating) return <Loading loading={creating} />;
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <h2 style={{ padding: "1rem 0" }}>Update Sectoral Group</h2>

      <InputWithLabel label="header" register={register("header")} />
      <br />
      <AdvancedEditor
        value={description}
        onChange={(val: string) => {
          setDescription(val);
          setValue("description", val, { shouldValidate: true });
        }}
      />
      <br />
      <InputWithLabel label="Image" type="file" register={register("image")} />
      <br />
      <Button styleType="whiteBg" style={{ width: "100%" }}>
        Update
      </Button>
    </form>
  );
};
