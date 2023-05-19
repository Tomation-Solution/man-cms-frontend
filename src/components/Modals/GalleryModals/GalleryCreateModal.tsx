import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import {
  AddMoreButton,
  CustomModalButton,
} from "../../../globals/styles/CustomFormComponents";
import { ModalsContainer } from "../Modals.styles";
import Button from "../../Button/Button";
import { convertImageToBase64String } from "../../../utils/ImageToBase64";
import { useMutation, useQueryClient } from "react-query";
import { galleryCreate } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import { validateFileExtension } from "../../../utils/extensionValidator";

const schema = yup.object().shape({
  name: yup.string().required(),
  images: yup
    .array()
    .of(
      yup.object({
        caption: yup.string().required("gallery item caption required"),
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
          .test({
            message: "Image must not exceed 1.5mb",
            test: (file: any, context) => {
              if (!file) {
                return false;
              }
              const isValid = file[0].size < 1500000;
              if (!isValid) {
                return isValid;
              }
              return isValid;
            },
          }),
      })
    )
    .min(1, "please provide atleast on gallery item")
    .max(
      2,
      "please no more than two images caption pairs during gallery creation, you can add more later on."
    )
    .required("images are required for the gallery"),
});

interface InputData extends yup.InferType<typeof schema> {}

const GalleryCreateModal: React.FC<{ closefn: () => void }> = ({ closefn }) => {
  const queryClient = useQueryClient();

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      images: [
        {
          caption: "",
          image: "",
        },
      ],
    },
  });

  const { append, remove, fields } = useFieldArray({
    control,
    name: "images",
  });

  const { isLoading, mutate } = useMutation(galleryCreate, {
    onMutate: () => {
      toast.info("gallery creating", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("gallery created", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-gallery");
      closefn();
    },
    onError: () => {
      toast.error("gallery not created", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = async (data: InputData) => {
    const { images, ...payload } = data;

    const newImages = images.map(async (item) => {
      const base64String = await convertImageToBase64String(item.image);
      return {
        caption: item.caption,
        image: base64String,
      };
    });

    const final = await Promise.all(newImages);
    mutate({ ...payload, images: final });
  };

  return (
    <>
      {isLoading ? (
        <Loading light loading />
      ) : (
        <ModalsContainer>
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Create Gallery</h2>
            <FormError>{errors?.name?.message}</FormError>
            <FormInput>
              <label>
                Name
                <br />
                <input type="text" {...register("name")} />
              </label>
            </FormInput>

            {fields.map((fields, index) => (
              <section key={fields.id}>
                <FormError>
                  {errors?.images?.[index]?.caption?.message}
                </FormError>
                <FormInput>
                  <label>
                    Caption
                    <br />
                    <input
                      type="text"
                      {...register(`images.${index}.caption`)}
                    />
                  </label>
                </FormInput>
                <FormError>{errors?.images?.[index]?.image?.message}</FormError>
                <FormInput>
                  <label>
                    Image
                    <br />
                    <input
                      type="file"
                      accept=".jpeg,.jpg,.png,.gif"
                      {...register(`images.${index}.image`)}
                    />
                  </label>
                </FormInput>
                <div>
                  <Button styleType={"whiteBg"} onClick={() => remove(index)}>
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.images?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => append({ caption: "", image: "" })}
            >
              Add More Images
            </AddMoreButton>

            <div>
              <CustomModalButton>CREATE</CustomModalButton>
            </div>
          </Form>
        </ModalsContainer>
      )}
    </>
  );
};

export default GalleryCreateModal;
