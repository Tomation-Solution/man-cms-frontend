import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormInput,
  FormError,
} from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { createUserApi } from "../../../axios/api-calls";
import { UserType } from "../../../axios/auth.types";

const schema = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  userType: yup.string().required("User type is required"),
});

type AdminFormInputs = {
  email: string;
  password: string;
  userType: UserType;
};

const CreateAdminModal: React.FC<{ closefn: () => void }> = ({ closefn }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminFormInputs>({
    resolver: yupResolver(schema),
  });

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(createUserApi, {
    onSuccess: () => {
      toast.success("Admin created successfully");
      reset();
      closefn();
      queryClient.invalidateQueries("admins");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create admin");
    },
  });

  const onSubmit = (data: AdminFormInputs) => {
    mutate(data);
  };

  return (
    <ModalsContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Create Admin</h2>
        <FormError>{errors.email?.message}</FormError>
        <FormInput>
          <label>
            Email
            <input type="email" {...register("email")} />
          </label>
        </FormInput>
        <FormError>{errors.password?.message}</FormError>
        <FormInput>
          <label>
            Password
            <input type="password" {...register("password")} />
          </label>
        </FormInput>
        <FormError>{errors.userType?.message}</FormError>
        <FormInput>
          <label>
            User Type
            <select {...register("userType")}>
              <option value="">Select User Type</option>
              <option value="super_user">Super User</option>
              <option value="event_training">Event Manager</option>
              <option value="public_view">Public View</option>
              <option value="publication_news">Publication News</option>
              <option value="registrations_payments">
                Registrations & Payments
              </option>
              <option value="prospective_certificates">
                Prospective Certificates
              </option>
              <option value="executive_secretary">Executive Secretary</option>
            </select>
          </label>
        </FormInput>
        <CustomModalButton>
          {isLoading ? "Creating..." : "Create Admin"}
        </CustomModalButton>
      </Form>
    </ModalsContainer>
  );
};

export default CreateAdminModal;
