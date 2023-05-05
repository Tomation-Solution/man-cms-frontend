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

const acceptedExtensions = [".jpeg", ".jpg", ".png", ".gif"];

function validateFileExtension(file: any) {
  if (typeof file === "string") {
    if (file.startsWith("data:image")) return true;
  }
  try {
    const fileName = file[0].name;
    const extension = "." + fileName.split(".").pop().toLowerCase();
    return acceptedExtensions.includes(extension);
  } catch (e) {
    return false;
  }
}

const schema = yup.object().shape({
  name: yup.string().required(),
  images: yup
    .array()
    .of(
      yup.object({
        caption: yup.string().required("gallery item caption required"),
        image: yup.mixed().test({
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
        }),
      })
    )
    .min(1, "please provide atleast on gallery item")
    .required("images are required for the gallery"),
});

interface InputData extends yup.InferType<typeof schema> {}

const GalleryCreateModal: React.FC<{ closefn: () => void }> = () => {
  const {
    register,
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

  const onSubmitHandler = async (data: InputData) => {
    const submitdata = { ...data };

    submitdata.images.forEach(async (item) => {
      const base64String = await convertImageToBase64String(item.image);
      item.image = base64String as string;
    });

    console.log(data);
  };

  return (
    <>
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

          <FormError>{errors?.images?.message}</FormError>
          {fields.map((fields, index) => (
            <section key={fields.id}>
              <FormError>{errors?.images?.[index]?.caption?.message}</FormError>
              <FormInput>
                <label>
                  Caption
                  <br />
                  <input type="text" {...register(`images.${index}.caption`)} />
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
    </>
  );
};

export default GalleryCreateModal;
