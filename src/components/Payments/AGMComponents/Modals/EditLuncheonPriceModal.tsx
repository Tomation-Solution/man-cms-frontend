import React from "react";
import Loading from "../../../Loading/Loading";
import BackDrop from "../../../BackDrop/BackDrop";
import { GalleryItemAddEditContainer } from "../../../Modals/GalleryModals/GalleryModal.styles";
import { ModalsContainer } from "../../../Modals/Modals.styles";
import { Form } from "../../../../globals/styles/forms.styles";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { updateLuncheonPrices } from "../../../../axios/api-calls";
import { toast } from "react-toastify";
import { CustomModalButton } from "../../../../globals/styles/CustomFormComponents";
import InputWithLabel from "../../../InputWithLabel/InputWithLabel";
import { formatMoney } from "../../../../utils/moneyFormatter";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const EditLuncheonPriceModal: React.FC<{
  closefn: () => void;
  luncheonData: { id: number; type: string; price: number } | undefined;
}> = ({ closefn, luncheonData }) => {
  const queryClient = useQueryClient();
  const schema = yup.object({
    price: yup.number().typeError("must be a number").positive().required(),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      price: "",
    },
  });

  const { isLoading, mutate } = useMutation(updateLuncheonPrices, {
    onMutate: () => {
      toast.info("editing luncheon", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("luncheon edited", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("luncheon-prices");
      closefn();
    },
    onError: () => {
      toast.error("failed to edit luncheon", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: any) => {
    mutate({ id: luncheonData?.id, ...data });
  };
  return (
    <>
      <BackDrop>
        <Loading loading={isLoading} />
        <GalleryItemAddEditContainer>
          <ModalsContainer>
            <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <h2>Edit Luncheon Prices</h2>
              <br />
              <h4>current price: {formatMoney(String(luncheonData?.price))}</h4>
              <br />

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

export default EditLuncheonPriceModal;
