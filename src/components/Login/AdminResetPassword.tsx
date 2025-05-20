import React from "react";
import {
  Form,
  FormButton,
  FormContainer,
  FormError,
  FormInput,
} from "../../globals/styles/forms.styles";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { adminResetPassword } from "../../axios/api-calls";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import Loading from "../Loading/Loading";

// Styled component for admin actions
export const AdminActionContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// Form schema for admin password reset
const schema = yup.object({
  user_id: yup.string().required("User ID is required"),
});

type AdminResetFormType = {
  user_id: string;
};

type AdminPasswordResetProps = {
  userId?: string; // Optional prop if user ID is pre-selected
  onComplete?: () => void; // Optional callback after successful reset
};

const AdminPasswordReset = ({
  userId,
  onComplete,
}: AdminPasswordResetProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      user_id: userId || "",
    },
  });

  const { mutate, isLoading } = useMutation(
    (data: AdminResetFormType) => adminResetPassword(data),
    {
      onMutate: () => {
        toast.info("Processing password reset request", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: (data) => {
        toast.success(data.message || "Password has been reset successfully", {
          progressClassName: "toastProgress",
          icon: false,
        });
        reset();
        if (onComplete) {
          onComplete();
        }
      },
      onError: (error) => {
        const err = error as AxiosError;
        toast.error("Oops an error occurred", {
          progressClassName: "toastProgress",
          icon: false,
        });
        toast.error(`Error ${err.message}`, {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
    }
  );

  const onSubmitHandler = (data: AdminResetFormType) => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset this user's password? They will receive an email with a temporary password."
    );
    if (confirmReset) {
      mutate(data);
    }
  };

  return (
    <>
      <Loading loading={isLoading} />
      <AdminActionContainer>
        <h3>Reset User Password</h3>
        <p>
          This will generate a temporary password and send it to the user's
          email address.
        </p>
        <Form onSubmit={handleSubmit(onSubmitHandler)}>
          <FormInput>
            <FormError>{errors?.user_id?.message}</FormError>
            User ID
            <br />
            <input
              type={"text"}
              {...register("user_id", { required: true })}
              disabled={!!userId} // Disable if userId is provided as prop
            />
          </FormInput>
          <FormButton>Reset Password</FormButton>
        </Form>
      </AdminActionContainer>
    </>
  );
};

export default AdminPasswordReset;
