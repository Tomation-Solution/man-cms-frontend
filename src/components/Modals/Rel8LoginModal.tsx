import React from "react";
import BackDrop from "../BackDrop/BackDrop";
import { GalleryItemAddEditContainer } from "./GalleryModals/GalleryModal.styles";
import { ModalsContainer } from "./Modals.styles";
import { Form } from "../../globals/styles/forms.styles";
import InputWithLabel from "../InputWithLabel/InputWithLabel";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CustomModalButton } from "../../globals/styles/CustomFormComponents";
import { useMutation } from "react-query";
import { rel8Login } from "../../axios/api-calls";
import { toast } from "react-toastify";
import useRel8AuthStore from "../../zustand/rel8-store";

const Rel8LoginModal: React.FC<{ closefn: () => void }> = ({ closefn }) => {
  const setUserfn = useRel8AuthStore.getState().setUser;

  const schema = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isLoading } = useMutation(rel8Login, {
    onSuccess: (data) => {
      toast.success("Rel8 login successful");
      setUserfn(data);
      closefn();
    },
    onError: () => {
      toast.error("Rel8 login failed");
    },
  });

  const onSubmitHandler = (data: yup.InferType<typeof schema>) => {
    mutate(data);
  };

  return (
    <>
      <BackDrop>
        <GalleryItemAddEditContainer>
          <ModalsContainer>
            <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <h4>We realized you're not logged into rel8, kindly login</h4>
              <br />
              <InputWithLabel
                register={register("email")}
                label="Email"
                errorMessage={errors.email?.message}
              />
              <InputWithLabel
                register={register("password")}
                label="Password"
                type="password"
                errorMessage={errors.password?.message}
              />

              <div>
                <CustomModalButton isDisabled={isLoading}>
                  LOGIN
                </CustomModalButton>
                <CustomModalButton isDisabled={isLoading} clickfn={closefn}>
                  CANCEL
                </CustomModalButton>
              </div>
            </Form>
          </ModalsContainer>
        </GalleryItemAddEditContainer>
      </BackDrop>
    </>
  );
};

export default Rel8LoginModal;
