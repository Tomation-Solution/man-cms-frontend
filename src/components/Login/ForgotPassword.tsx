import React, { useEffect } from "react";
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
import { requestPasswordReset } from "../../axios/api-calls";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import Loading from "../Loading/Loading";
import styled from "styled-components";

// Styled component for the forgot password container (similar to LoginContainer)
export const ForgotPasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

// Form schema for email validation
const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  frontend_url: yup.string().required(""),
});

type InputDataType = {
  email: string;
  frontend_url: string;
};

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InputDataType>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      frontend_url: "",
    },
  });

  useEffect(() => {
    const frontend_url = window.location.origin;
    setValue("frontend_url", frontend_url);
  }, []);

  const { mutate, isLoading } = useMutation(
    (data: InputDataType) => requestPasswordReset(data),
    {
      onMutate: () => {
        toast.info("Submitting request", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success(
          "If your email is registered, you will receive password reset instructions.",
          {
            progressClassName: "toastProgress",
            icon: false,
          }
        );
        reset(); // Clear the form
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

  return (
    <>
      <Loading loading={isLoading} />
      <ForgotPasswordContainer>
        <FormContainer>
          <h2 style={{ textAlign: "center" }}>Forgot Password</h2>
          <p style={{ textAlign: "center" }}>
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <FormInput>
              <FormError>{errors?.email?.message}</FormError>
              Email
              <br />
              <input type={"text"} {...register("email", { required: true })} />
            </FormInput>
            <FormButton>Send Reset Link</FormButton>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link to="/login">Back to Login</Link>
            </div>
          </Form>
        </FormContainer>
      </ForgotPasswordContainer>
    </>
  );
};

export default ForgotPassword;
