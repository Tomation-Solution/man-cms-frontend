import React from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { GalleryItemAddEditContainer } from "./GalleryModal.styles";
import BackDrop from "../../BackDrop/BackDrop";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "react-query";
import { galleryRename } from "../../../axios/api-calls";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";

const schema = yup.object({
  name: yup.string().required(),
});

interface InputData extends yup.InferType<typeof schema> {}

const GalleryRename: React.FC<{
  galleryId: number;
  galleryName: string;
  closefn: () => void;
}> = ({ galleryId, galleryName, closefn }) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate, isLoading } = useMutation(galleryRename, {
    onMutate: () => {
      toast.info("gallery renaming", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("gallery renamed", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-gallery");
      closefn();
    },
    onError: () => {
      toast.error("gallery item not updated", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: InputData) => {
    console.log(data);
    mutate({ id: galleryId, ...data });
  };
  return (
    <>
      <BackDrop>
        {isLoading ? (
          <Loading light loading={isLoading} />
        ) : (
          <GalleryItemAddEditContainer>
            <ModalsContainer>
              <Form onSubmit={handleSubmit(onSubmitHandler)}>
                <h2>Rename Gallery</h2>
                <br />
                <h4 style={{ textDecoration: "underline" }}>Curret name</h4>
                <p>{galleryName}</p>
                <br />
                <FormError>{errors?.name?.message}</FormError>
                <FormInput>
                  <label>
                    Name
                    <br />
                    <input
                      type="text"
                      {...register("name", { required: true })}
                    />
                  </label>
                </FormInput>

                <div>
                  <CustomModalButton>RENAME</CustomModalButton>
                  <CustomModalButton clickfn={closefn}>
                    CANCEL
                  </CustomModalButton>
                </div>
              </Form>
            </ModalsContainer>
          </GalleryItemAddEditContainer>
        )}
      </BackDrop>
    </>
  );
};

export default GalleryRename;
