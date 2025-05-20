import React from "react";
import {
  Form,
  FormButton,
  FormContainer,
  FormError,
  FormInput,
} from "../../globals/styles/forms.styles";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { confirmPasswordReset } from "../../axios/api-calls";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import Loading from "../Loading/Loading";
import styled from "styled-components";

// Styled component for the reset password container
export const ResetPasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

// Form schema for password reset validation
const schema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirm_password: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

type InputDataType = {
  password: string;
  confirm_password: string;
};

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL params
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const { mutate, isLoading } = useMutation(
    (data: InputDataType) =>
      confirmPasswordReset({ ...data, token: token || "" }),
    {
      onMutate: () => {
        toast.info("Resetting password", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("Password reset successful", {
          progressClassName: "toastProgress",
          icon: false,
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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

  const onSubmitHandler = (data: InputDataType) => {
    mutate(data);
  };

  // Check if token is available
  if (!token) {
    return (
      <ResetPasswordContainer>
        <FormContainer>
          <h2 style={{ textAlign: "center" }}>Invalid Reset Link</h2>
          <p style={{ textAlign: "center" }}>
            The password reset link appears to be invalid or expired.
          </p>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link to="/forgot-password">Request a new password reset link</Link>
          </div>
        </FormContainer>
      </ResetPasswordContainer>
    );
  }

  return (
    <>
      <Loading loading={isLoading} />
      <ResetPasswordContainer>
        <FormContainer>
          <h2 style={{ textAlign: "center" }}>Reset Password</h2>
          <p style={{ textAlign: "center" }}>
            Please enter your new password below.
          </p>
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <FormInput>
              <FormError>{errors?.password?.message}</FormError>
              New Password
              <br />
              <input
                type={"password"}
                {...register("password", { required: true })}
              />
            </FormInput>
            <FormInput>
              <FormError>{errors?.confirm_password?.message}</FormError>
              Confirm Password
              <br />
              <input
                type={"password"}
                {...register("confirm_password", { required: true })}
              />
            </FormInput>
            <FormButton>Reset Password</FormButton>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link to="/login">Back to Login</Link>
            </div>
          </Form>
        </FormContainer>
      </ResetPasswordContainer>
    </>
  );
};

export default ResetPassword;
