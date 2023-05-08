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
  operateBranchRetrieve,
  operateBranchUpdate,
} from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";

const schema = yup.object({
  name: yup
    .string()
    .max(300, "name shouldn't be more than 300 characters")
    .required(),
  email: yup.string().required(),
  address: yup
    .string()
    .max(300, "address shouldn't be more than 300 characters")
    .required(),
  manager_name: yup
    .string()
    .max(300, "manager name shouldn't be more than 300 characters")
    .required(),
  title: yup
    .string()
    .max(300, "title shouldn't be more than 300 characters")
    .required(),
});

// you can also use a type alias by this displays better in tooling
interface InputData extends Asserts<typeof schema> {}

const EditBranch: React.FC<{ closefn: () => void; id: number }> = ({
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
      manager_name: "",
      title: "",
      address: "",
    },
  });

  const { isLoading, isFetching, isError, data } = useQuery(
    `operate-branch-${id}`,
    () => operateBranchRetrieve(id),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      const main_data = {
        name: data.name,
        email: data.email,
        manager_name: data.manager_name,
        title: data.title,
        address: data.address,
      };
      reset(main_data);
    }
  }, [reset, data]);

  const { mutate, isLoading: editLoading } = useMutation(
    (data: { id: number; data: InputData }) => operateBranchUpdate(data),
    {
      onMutate: () => {
        toast.info("operate branch edits saving", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
      onSuccess: () => {
        toast.success("operate branch edits saved", {
          icon: false,
          progressClassName: "toastProgress",
        });
        queryClient.invalidateQueries(`operate-branch-${id}`);
        queryClient.invalidateQueries("all-operate-branch");
        closefn();
      },
      onError: () => {
        toast.error("operate branch edits not saved", {
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
        {isLoading || isFetching || editLoading ? (
          <Loading loading={isLoading} light />
        ) : !isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Create a Branch</h2>
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
            <FormError>{errors.manager_name?.message}</FormError>
            <FormInput>
              <label>
                Manager Name
                <br />
                <input
                  type="text"
                  {...register("manager_name", { required: true })}
                />
              </label>
            </FormInput>
            <FormError>{errors.title?.message}</FormError>
            <FormInput>
              <label>
                Title
                <br />
                <input type="text" {...register("title", { required: true })} />
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

            <div>
              <CustomModalButton isDisabled={isLoading}>SAVE</CustomModalButton>
            </div>
          </Form>
        ) : (
          <FormError>Can't Fetch Branch Data</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default EditBranch;
