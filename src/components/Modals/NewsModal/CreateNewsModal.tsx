import React from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { useForm, useFieldArray } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AddMoreButton,
  CustomModalButton,
} from "../../../globals/styles/CustomFormComponents";
import { useMutation, useQueryClient } from "react-query";
import { newsCreate } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import Button from "../../Button/Button";

type detailsObj = {
  header: string;
  value: string;
};

type formInputData = {
  name: string;
  title: string;
  link: string;
  image: any;
  details: detailsObj[];
};

const schema = yup.object({
  name: yup.string().required(),
  title: yup.string().required(),
  link: yup.string().url().required(),
  image: yup.mixed().required(),
  details: yup
    .array(
      yup.object({
        header: yup.string().required(),
        value: yup.string().required(),
      })
    )
    .min(1, "Please add atleast one header value pair"),
});

const CreateNewsModal: React.FC<{ closefn: () => void }> = ({ closefn }) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      title: "",
      link: "",
      image: null,
      details: [
        {
          header: "please fill header field",
          value: "please fill value field",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "details",
    control,
    rules: {
      required: "Please add atleast one header value pair",
    },
  });

  const { mutate, isLoading } = useMutation((data: any) => newsCreate(data), {
    onMutate: () => {
      toast.info("news creating", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("news created", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-news");
      closefn();
    },
    onError: () => {
      toast.error("news not created", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: formInputData) => {
    console.log(data);
    let { image, details, ...payload } = data;
    image = image[0];
    const FormDataHandler = new FormData();
    FormDataHandler.append("image", image);
    FormDataHandler.append("details", JSON.stringify(details));
    Object.keys(payload)?.forEach((key) =>
      //@ts-ignore
      FormDataHandler.append(key, payload[key])
    );
    mutate(FormDataHandler);
  };

  return (
    <>
      <ModalsContainer>
        {isLoading ? (
          <Loading light loading={isLoading} />
        ) : (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Create a News</h2>
            <br />
            <FormError>{errors?.name?.message}</FormError>
            <FormInput>
              <label>
                Name
                <br />
                <input type="text" {...register("name", { required: true })} />
              </label>
            </FormInput>
            <FormError>{errors?.image?.message}</FormError>
            <FormInput>
              <label>
                Image
                <br />
                <input
                  type="file"
                  accept="image/*"
                  required
                  {...register("image", { required: true })}
                />
              </label>
            </FormInput>
            <FormError>{errors?.title?.message}</FormError>
            <FormInput>
              <label>
                Title
                <br />
                <input type="text" {...register("title", { required: true })} />
              </label>
            </FormInput>
            <FormError>{errors?.link?.message}</FormError>
            <FormInput>
              <label>
                Read More Link*
                <br />
                <input type="text" {...register("link", { required: true })} />
              </label>
            </FormInput>

            {fields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Header*
                    <br />
                    <input
                      type={"text"}
                      style={{ backgroundColor: "#fff" }}
                      {...register(`details.${index}.header`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <FormInput>
                  <label>
                    Paragraph*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      rows={6}
                      cols={50}
                      {...register(`details.${index}.value`, {
                        required: true,
                      })}
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
            <FormError>{errors?.details?.message}</FormError>
            <AddMoreButton
              justify="flex-start"
              click={() =>
                append({
                  header: "please fill header field",
                  value: "please fill vlaue field",
                })
              }
            >
              Add More
            </AddMoreButton>

            <div>
              <CustomModalButton isDisabled={isLoading}>
                CREATE
              </CustomModalButton>
            </div>
          </Form>
        )}
      </ModalsContainer>
    </>
  );
};

export default CreateNewsModal;
