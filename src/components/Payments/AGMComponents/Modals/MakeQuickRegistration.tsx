import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { makeQuickRegistrations } from "../../../../axios/api-calls";
import { toast } from "react-toastify";
import * as yup from "yup";
import { ModalsContainer } from "../../../Modals/Modals.styles";
import { GalleryItemAddEditContainer } from "../../../Modals/GalleryModals/GalleryModal.styles";
import BackDrop from "../../../BackDrop/BackDrop";
import Loading from "../../../Loading/Loading";
import { CustomModalButton } from "../../../../globals/styles/CustomFormComponents";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Header } from "../../../../globals/styles/forms.styles";
import InputWithLabel from "../../../InputWithLabel/InputWithLabel";

const schema = yup.object({
  company_name: yup.string().required("company name is a required field"),
  designation: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().email().required(),
  phone_no: yup.string().required("phone number is a required field"),
});

const MakeQuickRegistration: React.FC<{ closefn: () => void }> = ({
  closefn,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      company_name: "",
      designation: "",
      name: "",
      email: "",
      phone_no: "",
    },
  });

  const { isLoading, mutate } = useMutation(makeQuickRegistrations, {
    onMutate: () => {
      toast.info("processing registration", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("registration processed", {
        icon: false,
        progressClassName: "toastProgress",
      });
      queryClient.invalidateQueries("all-quick-registrations");
      closefn();
    },
    onError: () => {
      toast.error("registration failed", {
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
      <BackDrop>
        <Loading loading={isLoading} />
        <GalleryItemAddEditContainer>
          <ModalsContainer>
            <Header>
              <h1>Make Quick AGM Registration</h1>
            </Header>
            <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <InputWithLabel
                label={"Name"}
                register={register("name")}
                errorMessage={errors.name?.message}
              />

              <InputWithLabel
                label={"Company Name"}
                register={register("company_name")}
                errorMessage={errors.company_name?.message}
              />

              <InputWithLabel
                label={"Email"}
                register={register("email")}
                errorMessage={errors.email?.message}
              />

              <InputWithLabel
                label={"Designation"}
                register={register("designation")}
                errorMessage={errors.designation?.message}
              />

              <InputWithLabel
                label={"Phone Number"}
                register={register("phone_no")}
                errorMessage={errors.phone_no?.message}
              />
              <div>
                <CustomModalButton>SAVE</CustomModalButton>
                <CustomModalButton clickfn={closefn}>CANCEL</CustomModalButton>
              </div>
            </Form>
          </ModalsContainer>
        </GalleryItemAddEditContainer>
      </BackDrop>
    </>
  );
};

export default MakeQuickRegistration;
