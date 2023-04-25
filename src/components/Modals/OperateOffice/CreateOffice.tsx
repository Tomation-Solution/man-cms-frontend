import React from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Asserts } from "yup";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { useMutation, useQueryClient } from "react-query";
import { operateOfficeCreate } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";

const schema = yup.object({
  name: yup
    .string()
    .max(300, "name shouldn't be more than 300 characters")
    .required(),
  email: yup.string().required(),
  phone_no: yup.string().required(),
  address: yup
    .string()
    .max(300, "name shouldn't be more than 300 characters")
    .required(),
  website: yup.string().url().required(),
});

const CreateOffice: React.FC<{ closefn: () => void }> = ({ closefn }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone_no: "",
      address: "",
      website: "",
    },
  });

  const { mutate, isLoading } = useMutation(
    (data: InputData) => operateOfficeCreate(data),
    {
      onMutate: () => {
        toast.info("operate office saving", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
      onSuccess: () => {
        toast.success("operate office saved", {
          icon: false,
          progressClassName: "toastProgress",
        });
        reset();
        queryClient.invalidateQueries("all-operate-office");
        closefn();
      },
      onError: () => {
        toast.error("operate office not saved", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  // you can also use a type alias by this displays better in tooling
  interface InputData extends Asserts<typeof schema> {}

  const onSubmitHandler = (data: InputData) => {
    mutate(data);
  };
  return (
    <>
      <ModalsContainer>
        {isLoading ? (
          <Loading loading={isLoading} light />
        ) : (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Create an Office</h2>
            <br />
            <FormError>{errors.name?.message}</FormError>
            <FormInput>
              <label>
                Name
                <br />
                <input type="text" {...register("name", { required: true })} />
              </label>
            </FormInput>
            <FormError>{errors.email?.message}</FormError>
            <FormInput>
              <label>
                Email
                <br />
                <small>
                  You can write multiple emails separated by a comma
                </small>
                <br />
                <input type="text" {...register("email", { required: true })} />
              </label>
            </FormInput>
            <FormError>{errors.phone_no?.message}</FormError>
            <FormInput>
              <label>
                Phone No
                <br />
                <small>
                  You can write multiple phone no's separated by a comma
                </small>
                <br />
                <input
                  type="text"
                  {...register("phone_no", { required: true })}
                />
              </label>
            </FormInput>
            <FormError>{errors.address?.message}</FormError>
            <FormInput>
              <label>
                Address
                <br />
                <input
                  type="text"
                  {...register("address", { required: true })}
                />
              </label>
            </FormInput>
            <FormError>{errors.website?.message}</FormError>
            <FormInput>
              <label>
                Website Link
                <br />
                <input
                  type="text"
                  {...register("website", { required: true })}
                />
              </label>
            </FormInput>
            <div>
              <CustomModalButton isDisabled={isLoading}>
                CREATE
              </CustomModalButton>
            </div>
          </Form>
        )}
      </ModalsContainer>
    </>
  );
};

export default CreateOffice;
