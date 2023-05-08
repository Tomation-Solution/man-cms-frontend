import React, { useEffect } from "react";
import BackDrop from "../../BackDrop/BackDrop";
import { GalleryItemAddEditContainer } from "./GalleryModal.styles";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  CustomModalButton,
  SelectImage,
} from "../../../globals/styles/CustomFormComponents";
import {
  galleryItemRetrieve,
  galleryItemUpdate,
} from "../../../axios/api-calls";
import Loading from "../../Loading/Loading";
import { toast } from "react-toastify";
import { convertImageToBase64String } from "../../../utils/ImageToBase64";

const schema = yup.object({
  caption: yup.string().required(),
  image: yup.mixed().notRequired(),
});

interface InputData extends yup.InferType<typeof schema> {}

const GalleryItemEdit: React.FC<{
  closefn: () => void;
  galleryItemId: number;
}> = ({ closefn, galleryItemId }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      caption: "",
      image: "",
    },
  });

  const { isLoading, isError, isFetching, data } = useQuery(
    `gallery-item-value-${galleryItemId}`,
    () => galleryItemRetrieve(galleryItemId),
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (data) {
      const main_data = {
        caption: data.caption,
        image: data.image,
      };

      reset(main_data);
    }
  }, [reset, data]);

  const { isLoading: updateLoading, mutateAsync } = useMutation(
    galleryItemUpdate,
    {
      onMutate: () => {
        toast.info("gallery item updating", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
      onSuccess: () => {
        toast.success("gallery item updated", {
          icon: false,
          progressClassName: "toastProgress",
        });
        reset();
        queryClient.invalidateQueries("all-gallery");
        queryClient.invalidateQueries(`gallery-item-value-${galleryItemId}`);
        closefn();
      },
      onError: () => {
        toast.error("gallery item not updated", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const onSubmitHandler = (data: InputData) => {
    let { image, caption } = data;

    let payload = {};

    if (typeof data.image !== "string" && data.image instanceof FileList) {
      const newImage = convertImageToBase64String(image);
      newImage.then((res: any) => {
        payload = { caption, image: res };

        mutateAsync({ id: galleryItemId, ...payload });
      });
    } else {
      payload = { caption };

      mutateAsync({ id: galleryItemId, ...payload });
    }
  };

  const previousMainCoreImage = getValues("image");

  return (
    <BackDrop overlay={true}>
      {isLoading || isFetching || updateLoading ? (
        <Loading light loading={isLoading || isFetching || updateLoading} />
      ) : !isError ? (
        <GalleryItemAddEditContainer>
          <ModalsContainer>
            <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <h2>Edit Gallery Item</h2>
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

              <SelectImage image={previousMainCoreImage} />

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
      ) : (
        <FormError>Can't Fetch Gallery Item Data</FormError>
      )}
    </BackDrop>
  );
};

export default GalleryItemEdit;
