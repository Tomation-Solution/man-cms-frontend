import React, { useEffect } from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
  FormSelect,
} from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { whyJoinRetrieve, whyJoinUpdate } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";

const schema = yup.object({
  header: yup.string().required(),
  description: yup.string().required(),
  type: yup.mixed().oneOf(["REASONS", "OTHERS"]).required(),
});

const WhyJoinEdit: React.FC<{ closefn: () => void; whyId: number }> = ({
  closefn,
  whyId,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      header: "",
      description: "",
      type: "",
    },
  });

  const { isLoading, isFetching, isError, data } = useQuery(
    `memership-why-join-${whyId}`,
    () => whyJoinRetrieve(whyId),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      const main_data = {
        header: data.header,
        description: data.description,
        type: data.type,
      };
      reset(main_data);
    }
  }, [reset, data]);

  const { mutate, isLoading: updateLoading } = useMutation(whyJoinUpdate, {
    onMutate: () => {
      toast.info("why join detail updating", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("why join detail updated", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries(`memership-why-join-${whyId}`);
      queryClient.invalidateQueries("all-why-join");
      closefn();
    },
    onError: () => {
      toast.error("why join detail not updated", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });
  const onSubmitHandler = (data: any) => {
    mutate({ id: whyId, data });
  };

  return (
    <>
      <ModalsContainer>
        {updateLoading || isLoading || isFetching ? (
          <Loading light loading={updateLoading || isLoading || isFetching} />
        ) : !isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <FormError>{errors?.header?.message}</FormError>
            <FormInput>
              <label>
                Header
                <br />
                <input
                  type="text"
                  {...register("header", { required: true })}
                />
              </label>
            </FormInput>

            <FormError>{errors?.description?.message}</FormError>
            <FormInput>
              <label>
                Description
                <br />
                <textarea {...register("description", { required: true })} />
              </label>
            </FormInput>

            <FormError>{errors?.type?.message}</FormError>
            <FormSelect>
              <label>
                Type
                <br />
                <select
                  defaultValue={""}
                  {...register("type", { required: true })}
                >
                  <option disabled value={""}>
                    select an option
                  </option>
                  <option value={"REASONS"}>REASONS</option>
                  <option value={"OTHERS"}>OTHERS</option>
                </select>
              </label>
            </FormSelect>

            <div>
              <CustomModalButton isDisabled={isLoading}>SAVE</CustomModalButton>
            </div>
          </Form>
        ) : (
          <FormError>Can't fetch Why Join Data</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default WhyJoinEdit;
