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
import { useMutation, useQueryClient } from "react-query";
import { ourMembersCreate } from "../../../axios/api-calls";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { toast } from "react-toastify";

const schema = yup.object({
  name: yup.string().required(),
  website: yup.string().url().notRequired(),
  description: yup.string().url().notRequired(),
});

interface InputData extends yup.InferType<typeof schema> {}

const OurMembersCreate: React.FC<{ closefn: () => void }> = ({ closefn }) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      website: "",
      description: "",
    },
  });

  const { isLoading, mutate } = useMutation(ourMembersCreate, {
    onMutate: () => {
      toast.info("Member creating", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("Member created", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-members");
      closefn();
    },
    onError: () => {
      toast.error("Member not created", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: InputData) => {
    mutate(data);
  };

  return (
    <>
      <ModalsContainer>
        <Form onSubmit={handleSubmit(onSubmitHandler)}>
          <h2>Create Member</h2>
          <br />
          <FormError>{errors?.name?.message}</FormError>
          <FormInput>
            <label>
              Name *
              <br />
              <input type="text" {...register("name")} />
            </label>
          </FormInput>
          <FormError>{errors?.website?.message}</FormError>
          <FormInput>
            <label>
              Website
              <br />
              <input type="text" {...register("website")} />
            </label>
          </FormInput>
          <FormError>{errors?.description?.message}</FormError>
          <FormInput>
            <label>
              Description
              <br />
              <input type="text" {...register("description")} />
            </label>
          </FormInput>

          <div>
            <CustomModalButton isDisabled={isLoading}>CREATE</CustomModalButton>
          </div>
        </Form>
      </ModalsContainer>
    </>
  );
};

export default OurMembersCreate;
