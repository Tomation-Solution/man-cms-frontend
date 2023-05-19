import React, { useEffect } from "react";
import { ExhibitionBootType } from "../LuncheonBootsSection";
import {
  ContactContainer,
  ModalsContainer,
} from "../../../Modals/Modals.styles";
import { GalleryItemAddEditContainer } from "../../../Modals/GalleryModals/GalleryModal.styles";
import BackDrop from "../../../BackDrop/BackDrop";
import Loading from "../../../Loading/Loading";
import { useMutation, useQueryClient } from "react-query";
import { updateExhibitionBoot } from "../../../../axios/api-calls";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Form, Header } from "../../../../globals/styles/forms.styles";
import InputWithLabel from "../../../InputWithLabel/InputWithLabel";
import { CustomModalButton } from "../../../../globals/styles/CustomFormComponents";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../../Button/Button";

const schema = yup.object({
  name: yup.string().required(),
  price: yup.number().typeError("must be a number").positive().required(),
});

const ExhibitionEditModal: React.FC<{
  data: ExhibitionBootType | undefined;
  closefn: () => void;
}> = ({ data, closefn }) => {
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

  useEffect(() => {
    if (data) {
      const main_data = {
        name: data.name,
        price: data.price,
      };

      reset(main_data);
    }
  }, [data]);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(updateExhibitionBoot, {
    onMutate: () => {
      toast.info("renaming boot", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("boot renamed", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-exhibition-boots");
      closefn();
    },
    onError: () => {
      toast.error("failed to rename boot", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (inputData: { name: string; price: string }) => {
    mutate({ id: data?.id, ...inputData });
  };

  const evictHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    mutate({ id: data?.id, is_occupied: false, rented_by: null });
  };

  return (
    <>
      <BackDrop>
        <Loading loading={isLoading} />
        <GalleryItemAddEditContainer>
          <ModalsContainer>
            <Header>
              <h1>Edit Exhibition Boot</h1>
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
              <ContactContainer>
                <p>
                  <span className="darkend">Is Rented Out: </span>
                  {data?.is_occupied ? "Yes" : "No"}
                </p>

                <p>
                  <span className="darkend">
                    Exhibitor Registration Id of Tenant:{" "}
                  </span>
                  {data?.rented_by ? data?.rented_by : "Free"}
                </p>
              </ContactContainer>

              {data?.is_occupied ? (
                <Button isSmall onClick={(e) => evictHandler(e)}>
                  Evict
                </Button>
              ) : null}

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

export default ExhibitionEditModal;
