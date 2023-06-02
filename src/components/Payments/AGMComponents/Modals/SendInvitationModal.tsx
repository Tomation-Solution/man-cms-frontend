import React from "react";
import BackDrop from "../../../BackDrop/BackDrop";
import { GalleryItemAddEditContainer } from "../../../Modals/GalleryModals/GalleryModal.styles";
import { ModalsContainer } from "../../../Modals/Modals.styles";
import {
  Form,
  FormError,
  FormSelect,
} from "../../../../globals/styles/forms.styles";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputWithLabel from "../../../InputWithLabel/InputWithLabel";
import { CustomModalButton } from "../../../../globals/styles/CustomFormComponents";
import { useMutation, useQueryClient } from "react-query";
import { invitationRegistration } from "../../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";

const schema = yup.object({
  email: yup.string().email().required(),
  company_name: yup.string().required("company name is a required field"),
  type: yup.mixed().oneOf(["guest", "media", "staff"]).required(),
});

interface InputData extends yup.InferType<typeof schema> {}

const SendInvitationModal: React.FC<{ closefn: () => void }> = ({
  closefn,
}) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", company_name: "", type: "" },
  });

  const { mutate, isLoading } = useMutation(invitationRegistration, {
    onMutate: () => {
      toast.info("sending invitation", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("invitation sent", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-invitations");
      closefn();
    },
    onError: () => {
      toast.error("failed to send invitation", {
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
      <Loading loading={isLoading} />
      <BackDrop>
        <GalleryItemAddEditContainer style={{ width: "400px" }}>
          <ModalsContainer>
            <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <InputWithLabel
                label={"Email"}
                register={register("email")}
                errorMessage={errors.email?.message}
              />

              <InputWithLabel
                label={"Company Name"}
                register={register("company_name")}
                errorMessage={errors.company_name?.message}
              />

              <FormSelect>
                <label>Type</label>
                <select {...register("type")}>
                  <option value={"guest"}>guest</option>
                  <option value={"media"}>media</option>
                  <option value={"staff"}>staff</option>
                </select>
              </FormSelect>
              <FormError>{errors.type?.message}</FormError>

              <div>
                <CustomModalButton>SEND</CustomModalButton>
                <CustomModalButton clickfn={closefn}>CANCEL</CustomModalButton>
              </div>
            </Form>
          </ModalsContainer>
        </GalleryItemAddEditContainer>
      </BackDrop>
    </>
  );
};

export default SendInvitationModal;
