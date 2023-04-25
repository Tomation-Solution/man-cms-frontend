import React from "react";
import {
  Form,
  FormButton,
  FormContainer,
  FormError,
  FormInput,
} from "../../globals/styles/forms.styles";
import { LoginContainer } from "./Login.styles";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { loginUser } from "../../axios/api-calls";
import { toast } from "react-toastify";
import { useAuthStore } from "../../zustand/store";
import { Navigate, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Loading from "../Loading/Loading";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

type InputDataType = {
  email: string;
  password: string;
};

const Login = () => {
  const setUserFn = useAuthStore.getState().setUser;
  const userData = useAuthStore.getState().user;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const { mutate, isLoading } = useMutation(
    (data: InputDataType) => loginUser(data),
    {
      onMutate: () => {
        toast.info("validating credentials", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: (data) => {
        toast.success("Login Successful", {
          progressClassName: "toastProgress",
          icon: false,
        });
        setUserFn(data);
        navigate("/publications");
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

  if (userData) {
    return <Navigate to="/publications" />;
  }

  return (
    <>
      <Loading loading={isLoading} />
      <LoginContainer>
        <FormContainer>
          <h2 style={{ textAlign: "center" }}>User Registration</h2>
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <FormInput>
              <FormError>{errors?.email?.message}</FormError>
              Email
              <br />
              <input type={"text"} {...register("email", { required: true })} />
            </FormInput>
            <FormInput>
              <FormError>{errors?.password?.message}</FormError>
              Password
              <br />
              <input
                type={"password"}
                {...register("password", { required: true })}
              />
              <br />
              <FormButton>Submit</FormButton>
            </FormInput>
          </Form>
        </FormContainer>
      </LoginContainer>
    </>
  );
};

export default Login;
