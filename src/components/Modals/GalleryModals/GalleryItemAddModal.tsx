import React from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { validateFileExtension } from "../../../utils/extensionValidator";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { useMutation, useQueryClient } from "react-query";
import { galleryItemAdd } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import BackDrop from "../../BackDrop/BackDrop";
import { GalleryItemAddEditContainer } from "./GalleryModal.styles";
import { convertImageToBase64String } from "../../../utils/ImageToBase64";

const schema = yup.object({
  caption: yup.string().required(),
  image: yup
    .mixed()
    .test({
      message: "Please provide a supported file type",
      test: (file, context) => {
        if (!file) {
          return false;
        }
        const isValid = validateFileExtension(file);
        if (!isValid) {
          return isValid;
        }
        return isValid;
      },
    })
    .required("image is required for the gallery"),
});

interface InputData extends yup.InferType<typeof schema> {}

const GalleryItemAddModal: React.FC<{
  galleryid: number;
  closefn: () => void;
}> = ({ galleryid, closefn }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      caption: "",
      image: "",
    },
  });

  const { isLoading, mutate } = useMutation(galleryItemAdd, {
    onMutate: () => {
      toast.info("gallery item creating", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("gallery item created", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-gallery");
      queryClient.invalidateQueries(`gallery-item-${galleryid}`);
      closefn();
    },
    onError: () => {
      toast.error("gallery item not created", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: InputData) => {
    const { image, ...payload } = data;

    const newImage = convertImageToBase64String(image);
    newImage.then((res: any) => {
      mutate({ gallery: galleryid, image: res, ...payload });
    });
  };

  return (
    <BackDrop overlay={true}>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <GalleryItemAddEditContainer>
          <ModalsContainer>
            <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <h2>Add Gallery Item</h2>
              <br />
              <FormError>{errors?.caption?.message}</FormError>
              <FormInput>
                <label>
                  Caption
                  <br />
                  <input
                    type="text"
                    {...register("caption", { required: true })}
                  />
                </label>
              </FormInput>

              <FormError>{errors?.image?.message}</FormError>
              <FormInput>
                <label>
                  Image
                  <br />
                  <input
                    type="file"
                    accept=".jpeg,.jpg,.png,.gif"
                    {...register("image", { required: true })}
                  />
                </label>
              </FormInput>

              <div>
                <CustomModalButton>ADD</CustomModalButton>
                <CustomModalButton clickfn={closefn}>CANCEL</CustomModalButton>
              </div>
            </Form>
          </ModalsContainer>
        </GalleryItemAddEditContainer>
      )}
    </BackDrop>
  );
};

export default GalleryItemAddModal;
