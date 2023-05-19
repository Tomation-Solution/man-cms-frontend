import React from "react";
import { Form, Header } from "../../../../globals/styles/forms.styles";
import { ModalsContainer } from "../../../Modals/Modals.styles";
import { GalleryItemAddEditContainer } from "../../../Modals/GalleryModals/GalleryModal.styles";
import Loading from "../../../Loading/Loading";
import BackDrop from "../../../BackDrop/BackDrop";
import { useMutation, useQueryClient } from "react-query";
import { createExhibitionBoot } from "../../../../axios/api-calls";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomModalButton } from "../../../../globals/styles/CustomFormComponents";
import InputWithLabel from "../../../InputWithLabel/InputWithLabel";

const schema = yup.object({
  name: yup.string().required(),
  price: yup.number().typeError("must be a number").positive().required(),
});

const ExhibitionBootCreateModal: React.FC<{ closefn: () => void }> = ({
  closefn,
}) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      price: "",
    },
  });

  const { isLoading, mutate } = useMutation(createExhibitionBoot, {
    onMutate: () => {
      toast.info("creating boot", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("boot created", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-exhibition-boots");
      closefn();
    },
    onError: () => {
      toast.error("failed to create boot", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (inputData: { name: string; price: string }) => {
    mutate(inputData);
  };
  return (
    <>
      <BackDrop>
        <Loading loading={isLoading} />
        <GalleryItemAddEditContainer>
          <ModalsContainer>
            <Header>
              <h1>Create Exhibition Boot</h1>
            </Header>
            <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <InputWithLabel
                label={"Name"}
                register={register("name")}
                errorMessage={errors.name?.message}
              />
              <InputWithLabel
                label={"Price"}
                register={register("price")}
                errorMessage={errors.price?.message}
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

export default ExhibitionBootCreateModal;
