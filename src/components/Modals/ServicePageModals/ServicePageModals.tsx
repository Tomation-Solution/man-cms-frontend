import React, { useEffect } from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { useForm, useFieldArray } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputWithLabel, {
  SelectWithLabel,
} from "../../InputWithLabel/InputWithLabel";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { useMutation, useQueryClient } from "react-query";
import { createService, updateServiceApi } from "../../../axios/api-calls";
import Loading from "../../Loading/Loading";
import { toast } from "react-toastify";

const schema = yup.object({
  name: yup.string().required(),
  type: yup.string(),
  description: yup.string().required(),
  image: yup.mixed(),
});

export type ServicePageCreationType = yup.InferType<typeof schema>;

const ServicePageModals = (): React.ReactElement => {
  const queryClient = useQueryClient();
  const [type, setType] = React.useState("CORE");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServicePageCreationType>({
    resolver: yupResolver(schema),
  });
  const { mutate, isLoading } = useMutation(createService, {
    onSuccess: (data) => {
      reset();
      toast.success(`${data.name} created!`, {
        progressClassName: "toastProgress",
        icon: false,
      });
      queryClient.invalidateQueries("services-list");
    },
    onError: (err: any) => {
      console.log({ err });
      // toast.error("${data.name} deleted!", {
      //     icon: false,
      //     progressClassName: "toastProgress",
      //   });
    },
  });

  const onSubmitHandler = (data: ServicePageCreationType) => {
    // console.log(data)
    mutate({ ...data, type });
  };
  if (isLoading) return <Loading loading={isLoading} />;
  return (
    <Form onSubmit={handleSubmit(onSubmitHandler)}>
      <h2 style={{ padding: "1rem 0" }}>Create a Service</h2>
      <InputWithLabel
        label="Name"
        register={register("name")}
        errorMessage={errors.name?.message}
      />
      <br />
      {/* <InputWithLabel
                label="Type"
                register={register('type')}
            /> */}
      <SelectWithLabel
        label="Type Of Services"
        formName="type"
        setValue={setValue}
        onchange={(e: any) => {
          setType(e.target.value);
          setValue("type", e.target.value);
        }}
        errorMessage={errors.type?.message}
        options={[
          { label: "CORE", option: "CORE" },
          { label: "MRC", option: "MRC" },
          { label: "MPDCL", option: "MPDCL" },
        ]}
      />
      <br />
      <InputWithLabel
        label="Image"
        register={register("image")}
        // isTextArea={true}
        type="file"
      />
      <br />

      <InputWithLabel
        label="Description"
        register={register("description")}
        isTextArea={true}
        errorMessage={errors.description?.message}
      />
      <br />

      <div>
        <CustomModalButton
        //   isDisabled={isLoading}
        >
          CREATE
        </CustomModalButton>
      </div>
    </Form>
  );
};

export default ServicePageModals;

const updateSchema = yup.object({
  name: yup.string().required(),
  type: yup.string(),
  description: yup.string().required(),
  image: yup.mixed(),
  id: yup.number(),
});
export type ServicePageModalsUpdateFormType = yup.InferType<
  typeof updateSchema
>;

export const ServicePageModalsUpdate = ({
  data,
}: {
  data: ServicePageModalsUpdateFormType;
}): React.ReactElement => {
  const queryClient = useQueryClient();
  const [type, setType] = React.useState("CORE");

  const { mutate: Update, isLoading } = useMutation(updateServiceApi, {
    onSuccess: (data) => {
      toast.success(`${data.name} updated!`, {
        progressClassName: "toastProgress",
        icon: false,
      });
      queryClient.invalidateQueries("services-list");
    },
    onError: (err: any) => {
      console.log({ err });
      // toast.error("${data.name} deleted!", {
      //     icon: false,
      //     progressClassName: "toastProgress",
      //   });
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServicePageModalsUpdateFormType>({
    resolver: yupResolver(updateSchema),
  });

  const onSubmitHandler = (data: ServicePageModalsUpdateFormType) => {
    if (data?.id) {
      Update({ data: { ...data, type }, id: data.id });
    }
  };

  useEffect(() => {
    setValue("name", data.name);
    setValue("description", data.description);
    setValue("type", data.type);
    setValue("image", data.image);
    if (data?.id) {
      setValue("id", data.id);
    }
  }, [data]);

  return (
    <div>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Form onSubmit={handleSubmit(onSubmitHandler)}>
          <Loading loading={isLoading} />
          <h2 style={{ padding: "1rem 0" }}>Update Service</h2>
          <InputWithLabel
            label="Name"
            register={register("name")}
            errorMessage={errors.name?.message}
          />
          <br />
          {/* <InputWithLabel
                label="Type"
                register={register('type')}
            /> */}
          <SelectWithLabel
            label="Type Of Services"
            formName="type"
            setValue={setValue}
            onchange={(e: any) => {
              setType(e.target.value);
              setValue("type", e.target.value);
            }}
            errorMessage={errors.type?.message}
            options={[
              { label: "CORE", option: "CORE" },
              { label: "MRC", option: "MRC" },
              { label: "MPDCL", option: "MPDCL" },
            ]}
          />
          <br />
          <InputWithLabel
            label="Image"
            register={register("image")}
            // isTextArea={true}
            type="file"
          />
          <br />

          <InputWithLabel
            label="Description"
            register={register("description")}
            isTextArea={true}
            errorMessage={errors.description?.message}
          />
          <br />

          <div>
            <CustomModalButton>Update</CustomModalButton>
          </div>
        </Form>
      )}
    </div>
  );
};
