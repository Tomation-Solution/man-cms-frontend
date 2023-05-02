import React from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
  FormSelect,
} from "../../../globals/styles/forms.styles";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { useMutation, useQueryClient } from "react-query";
import { whyJoinCreate } from "../../../axios/api-calls";
import { toast } from "react-toastify";

const schema = yup.object({
  header: yup.string().required(),
  description: yup.string().required(),
  type: yup.mixed().oneOf(["REASONS", "OTHERS"]).required(),
});

interface InputData extends yup.InferType<typeof schema> {}

const WhyJoinCreate: React.FC<{ closefn: () => void }> = ({ closefn }) => {
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

  const { mutate, isLoading } = useMutation(whyJoinCreate, {
    onMutate: () => {
      toast.info("why join detail creating", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("why join detail created", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-why-join");
      closefn();
    },
    onError: () => {
      toast.error("why join detail not created", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: any) => {
    mutate(data);
  };

  return (
    <>
      <ModalsContainer>
        <Form onSubmit={handleSubmit(onSubmitHandler)}>
          <h2>Create Why Join Item</h2>
          <FormError>{errors?.header?.message}</FormError>
          <FormInput>
            <label>
              Header
              <br />
              <input type="text" {...register("header", { required: true })} />
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
            <CustomModalButton isDisabled={isLoading}>CREATE</CustomModalButton>
          </div>
        </Form>
      </ModalsContainer>
    </>
  );
};

export default WhyJoinCreate;
