import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputWithLabel, {
  SelectWithLabel,
} from "../../components/InputWithLabel/InputWithLabel";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Button from "../Button/Button";
import {
  createExecutiveApi,
  deleteExecutiveApi,
  updateExecutiveApi,
} from "../../axios/api-calls";
import Loading from "../Loading/Loading";
import { useEffect, useState } from "react";
import { ModalsContainer } from "./Modals.styles";
import { Header } from "../../globals/styles/forms.styles";
import { CustomModalButton } from "../../globals/styles/CustomFormComponents";

const schema = yup.object({
  name: yup.string().required(),
  image: yup.mixed(),
  id: yup.number(),
  tenor: yup.string(),
  title: yup.string().required(),
  order_position: yup
    .number()
    .positive("Display order must be a positive number")
    .integer("Display order must be an integer"),
  extra_title1: yup.string(),
  extra_title2: yup.string(),
  type: yup.string(),
});
type FormI = yup.InferType<typeof schema>;
const CreateOurExcutiveModal = () => {
  const queryClient = useQueryClient();
  const [type, setType] = useState("EXECUTIVE");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormI>({
    resolver: yupResolver(schema),
  });

  const { isLoading, mutate } = useMutation(createExecutiveApi, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("getExecutiveApi");
      toast.success("Created Successfully", {
        progressClassName: "toastProgress",
        icon: false,
      });
    },
  });

  const onSubmitHandler = (data: FormI) => {
    mutate({ ...data, type });
  };

  console.log({ errors });

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Loading loading={isLoading} />
      <InputWithLabel
        label="Name"
        register={register("name")}
        errorMessage={errors.name?.message}
      />
      <br />
      <InputWithLabel
        label="Title"
        register={register("title")}
        errorMessage={errors.title?.message}
      />
      <br />
      <InputWithLabel
        label="Display Order"
        type="number"
        placeholder="Lower numbers appear first."
        register={register("order_position")}
        errorMessage={errors.order_position?.message}
      />
      <br />
      <InputWithLabel label="Image" type="file" register={register("image")} />
      <br />
      <SelectWithLabel
        formName="type"
        setValue={setValue}
        onchange={(e: any) => {
          setType(e.target.value);
          setValue("type", e.target.value);
        }}
        options={[
          { label: "EXECUTIVE", option: "EXECUTIVE" },
          { label: "BRANCH", option: "BRANCH" },
          { label: "SECTORAL", option: "SECTORAL" },
          {
            label: "SPECIAL_PURPOSE_VEHICLES",
            option: "SPECIAL_PURPOSE_VEHICLES",
          },
          { label: "SPECIAL_PURPOSE_GROUPS", option: "SPECIAL_PURPOSE_GROUPS" },
          { label: "LIFE_MEMBERS", option: "LIFE_MEMBERS" },
          { label: "ELECTED_MEMBERS", option: "ELECTED_MEMBERS" },
          { label: "STRATEGIC_MEMBERS", option: "STRATEGIC_MEMBERS" },
        ]}
        label="Type"
        errorMessage={errors.type?.message}
      />
      <br />
      <small>the field below is for life members only</small>
      <InputWithLabel
        placeholder="please provide the tenor of life member"
        label="Tenor"
        type="text"
        register={register("tenor")}
        errorMessage={errors.tenor?.message}
      />
      <br />

      <InputWithLabel
        label="Extra Title One*"
        register={register("extra_title1")}
        errorMessage={errors.extra_title1?.message}
      />
      <br />
      <InputWithLabel
        label="Extra Title Two*"
        register={register("extra_title2")}
        errorMessage={errors.extra_title2?.message}
      />
      <br />

      <Button styleType="whiteBg">Create</Button>
    </form>
  );
};
export default CreateOurExcutiveModal;

export const UpdateOurExcutiveModal = ({ data }: { data?: FormI }) => {
  const queryClient = useQueryClient();
  const [type, setType] = useState("EXECUTIVE");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormI>({
    resolver: yupResolver(schema),
  });

  const { isLoading, mutate } = useMutation(updateExecutiveApi, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("getExecutiveApi");
      toast.success("Updated Successfully", {
        progressClassName: "toastProgress",
        icon: false,
      });
    },
  });
  const onSubmitHandler = (data: FormI) => {
    mutate({ ...data, type });
    setValue("name", "");
    setValue("extra_title1", "");
    setValue("extra_title2", "");
    setValue("image", "");
    setValue("tenor", "");
    setValue("title", "");
    setValue("type", "");
  };

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("extra_title1", data.extra_title1);
      setValue("extra_title2", data.extra_title2);
      setValue("image", data.image);
      setValue("id", data.id);
      setValue("tenor", data.tenor);
      setValue("title", data.title);
      setValue("type", data.type);
      setValue("order_position", data.order_position);
      setType(data.type !== null ? "EXECUTIVE" : data.type);
    }
  }, [data]);
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Loading loading={isLoading} />
      <InputWithLabel label="Name" register={register("name")} />
      <br />
      <InputWithLabel label="Title" register={register("title")} />
      <br />
      <InputWithLabel label="Image" type="file" register={register("image")} />
      <br />
      <InputWithLabel
        label="Display Order"
        type="number"
        placeholder="Lower numbers appear first."
        register={register("order_position")}
        errorMessage={errors.order_position?.message}
      />
      <br />
      <SelectWithLabel
        formName="type"
        setValue={setValue}
        onchange={(e: any) => {
          setType(e.target.value);
          setValue("type", e.target.value);
        }}
        options={[
          { label: "EXECUTIVE", option: "EXECUTIVE" },
          { label: "BRANCH", option: "BRANCH" },
          { label: "SECTORAL", option: "SECTORAL" },
          {
            label: "SPECIAL_PURPOSE_VEHICLES",
            option: "SPECIAL_PURPOSE_VEHICLES",
          },
          { label: "SPECIAL_PURPOSE_GROUPS", option: "SPECIAL_PURPOSE_GROUPS" },
          { label: "LIFE_MEMBERS", option: "LIFE_MEMBERS" },
          { label: "ELECTED_MEMBERS", option: "ELECTED_MEMBERS" },
          { label: "STRATEGIC_MEMBERS", option: "STRATEGIC_MEMBERS" },
        ]}
        label="Title"
      />
      <br />

      <small>the field below is for life members only</small>
      <InputWithLabel
        placeholder="please provide the tenor of life member"
        label="Tenor"
        type="text"
        register={register("tenor")}
      />
      <br />

      <InputWithLabel
        label="Extra Title One*"
        register={register("extra_title1")}
      />
      <br />
      <InputWithLabel
        label="Extra Title Two*"
        register={register("extra_title2")}
      />
      <br />

      <Button styleType="whiteBg">Update</Button>
    </form>
  );
};

export const DeleteExecutiveModal: React.FC<{
  execId: number;
  execName: string;
  closefn: () => void;
}> = ({ execId, execName, closefn }) => {
  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation(deleteExecutiveApi, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("getExecutiveApi");
    },
  });

  const deleteHandler = () => {
    mutate(execId);
    closefn();
  };

  return (
    <ModalsContainer>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <>
          <Header>
            ARE YOU SURE YOU WANT TO DELETE EXECUTIVE WITH THE NAME "{execName}"
          </Header>
          <CustomModalButton clickfn={deleteHandler}>DELETE</CustomModalButton>
        </>
      )}
    </ModalsContainer>
  );
};
