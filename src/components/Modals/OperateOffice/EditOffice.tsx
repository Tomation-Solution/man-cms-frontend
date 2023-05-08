import React, { useEffect } from "react";

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
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  operateOfficeRetrieve,
  operateOfficeUpdate,
} from "../../../axios/api-calls";
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

// you can also use a type alias by this displays better in tooling
interface InputData extends Asserts<typeof schema> {}

const EditOffice: React.FC<{ closefn: () => void; id: number }> = ({
  closefn,
  id,
}) => {
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

  const { isLoading, isFetching, isError, data } = useQuery(
    `operate-office-${id}`,
    () => operateOfficeRetrieve(id),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      const main_data = {
        name: data.name,
        email: data.email,
        phone_no: data.phone_no,
        address: data.address,
        website: data.website,
      };
      reset(main_data);
    }
  }, [reset, data]);

  const { mutate, isLoading: editLoading } = useMutation(
    (data: { id: number; data: InputData }) => operateOfficeUpdate(data),
    {
      onMutate: () => {
        toast.info("operate office edits saving", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
      onSuccess: () => {
        toast.success("operate office edits saved", {
          icon: false,
          progressClassName: "toastProgress",
        });
        queryClient.invalidateQueries(`operate-office-${id}`);
        queryClient.invalidateQueries("all-operate-office");
        closefn();
      },
      onError: () => {
        toast.error("operate office edits not saved", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const onSubmitHandler = (data: InputData) => {
    mutate({ id, data });
  };

  return (
    <>
      <ModalsContainer>
        {isLoading || editLoading || isFetching ? (
          <Loading loading={isLoading || editLoading || isFetching} light />
        ) : !isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Edit an Office</h2>
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
              <CustomModalButton isDisabled={isLoading}>SAVE</CustomModalButton>
            </div>
          </Form>
        ) : (
          <FormError>Can't Fetch Ofice Data</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default EditOffice;
