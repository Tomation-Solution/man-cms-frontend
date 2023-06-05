import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputWithLabel, {
  SelectWithLabel,
} from "../../components/InputWithLabel/InputWithLabel";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Button from "../Button/Button";
import { createExecutiveApi, updateExecutiveApi } from "../../axios/api-calls";
import Loading from "../Loading/Loading";
import { useEffect } from "react";

const schema = yup.object({
  name: yup.string().required(),
  image: yup.mixed(),
  id: yup.number(),
  tenor: yup.string(),
  title: yup.string().required(),
  extra_title1: yup.string(),
  extra_title2: yup.string(),
  type: yup.string().required(),
});
type FormI = yup.InferType<typeof schema>;
const CreateOurExcutiveModal = () => {
  const queryClient = useQueryClient();

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
    mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Loading loading={isLoading} />
      <InputWithLabel label="Name" register={register("name")} />
      <br />
      <InputWithLabel label="Title" register={register("title")} />
      <br />
      <InputWithLabel label="Image" type="file" register={register("image")} />
      <br />
      <SelectWithLabel
        formName="type"
        setValue={setValue}
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

      <Button styleType="whiteBg">Create</Button>
    </form>
  );
};
export default CreateOurExcutiveModal;

export const UpdateOurExcutiveModal = ({ data }: { data?: FormI }) => {
  const queryClient = useQueryClient();

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
    mutate(data);
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
      <SelectWithLabel
        formName="type"
        setValue={setValue}
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
