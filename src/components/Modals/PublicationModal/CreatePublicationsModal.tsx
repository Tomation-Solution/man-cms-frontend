import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  AddMoreButton,
  CustomModalButton,
} from "../../../globals/styles/CustomFormComponents";
import {
  Form,
  FormError,
  FormInput,
  FormSelect,
} from "../../../globals/styles/forms.styles";
import Button from "../../Button/Button";
import { ModalsContainer } from "../Modals.styles";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  publicationCreate,
  publicationTypesGetAll,
} from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import { validateFileExtension } from "../../../utils/extensionValidator";

type detailsObj = {
  header: string;
  value: string;
};

type formInputData = {
  name: string;
  title: string;
  link: string;
  is_paid: string;
  price: string;
  type: string;
  image: any;
  details: detailsObj[];
};

const schema = yup.object({
  name: yup.string().required(),
  title: yup.string().required(),
  link: yup.mixed().test({
    message: "Please provide a supported file type",
    test: (file, context) => {
      if (!file) {
        return false;
      }
      const isValid = validateFileExtension(file, false);
      if (!isValid) {
        return isValid;
      }
      return isValid;
    },
  }),
  image: yup.mixed().required(),
  is_paid: yup.string().required(),
  type: yup.string().required(),
  details: yup
    .array(
      yup.object({
        header: yup.string().required(),
        value: yup.string().required(),
      })
    )
    .min(1, "Please add atleast one header value pair"),
});

const CreatePublicationsModal = () => {
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
      type: "",
      price: "",
      is_paid: "",
      image: null,
      details: [
        {
          header: "please fill header field",
          value: "please fill value field",
        },
      ],
    },
  });

  const {
    isLoading: getLoading,
    isFetching,
    isError,
    data,
  } = useQuery("all-publication-types", publicationTypesGetAll, {
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });

  const { mutate, isLoading } = useMutation(
    (data: any) => publicationCreate(data),
    {
      onMutate: () => {
        toast.info("publication saving", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
      onSuccess: () => {
        toast.success("publication saved", {
          icon: false,
          progressClassName: "toastProgress",
        });
        reset();
        queryClient.invalidateQueries("all-publication");
      },
      onError: () => {
        toast.error("publication not saved", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const { fields, append, remove } = useFieldArray({
    name: "details",
    control,
    rules: {
      required: "Please add atleast one header value pair",
    },
  });

  const onSubmitHandler = (data: formInputData) => {
    if (data.is_paid == "true") {
      let { image, details, link, ...payload } = data;
      image = image[0];

      const FormDataHandler = new FormData();
      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      FormDataHandler.append("image", image);
      FormDataHandler.append("link", link[0]);
      FormDataHandler.append("details", JSON.stringify(details));

      mutate(FormDataHandler);
    } else {
      let { image, details, price, link, ...payload } = data;
      image = image[0];

      const FormDataHandler = new FormData();
      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      FormDataHandler.append("image", image);
      FormDataHandler.append("link", link[0]);
      FormDataHandler.append("details", JSON.stringify(details));

      mutate(FormDataHandler);
    }
  };
  return (
    <>
      <ModalsContainer>
        {isLoading || getLoading || isFetching ? (
          <Loading light loading={isLoading || getLoading || isFetching} />
        ) : !isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Create a Publication</h2>
            <br />
            <FormError>{errors?.name?.message}</FormError>
            <FormInput>
              <label>
                Name*
                <br />
                <input
                  type={"text"}
                  style={{ backgroundColor: "#fff" }}
                  {...register("name", { required: true })}
                />
              </label>
            </FormInput>

            <FormError>{errors?.image?.message}</FormError>
            <FormInput>
              <label>
                Image*
                <br />
                <input
                  type={"file"}
                  accept="image/*"
                  required
                  style={{ backgroundColor: "#fff", color: "#000" }}
                  {...register("image", { required: true })}
                />
              </label>
            </FormInput>

            <FormError>{errors?.is_paid?.message}</FormError>
            <FormSelect>
              <label>
                Is this a paid publication*
                <br />
                <small>if true a valid price must be provided</small>
                <br />
                <select
                  defaultValue={"false"}
                  {...register("is_paid", { required: true })}
                >
                  <option disabled>select an option</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </label>
            </FormSelect>

            <FormError>{errors?.price?.message}</FormError>
            <FormInput>
              <label>
                Price
                <br />
                <input
                  type="number"
                  min={0}
                  style={{ backgroundColor: "#fff" }}
                  {...register("price", { required: false })}
                />
              </label>
            </FormInput>

            <FormError>{errors?.type?.message}</FormError>
            <FormSelect>
              <label>
                Type*
                <br />
                <select
                  defaultValue={"OTHERS"}
                  {...register("type", { required: true })}
                >
                  <option disabled>select an option</option>
                  {data.map((item: { name: string; id: number }) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </FormSelect>

            <FormError>{errors?.title?.message}</FormError>
            <FormInput>
              <label>
                Title*
                <br />
                <input
                  type={"text"}
                  style={{ backgroundColor: "#fff" }}
                  {...register("title", { required: true })}
                />
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

            <FormError>{errors?.link?.message}</FormError>
            <FormInput>
              <label>
                Upload File*
                <br />
                <input
                  type={"file"}
                  accept=".doc,.docx,.odt,.pdf,.xls,.xlsx,.ppt,.pptx,.txt,.ods"
                  style={{ backgroundColor: "#fff" }}
                  {...register("link", { required: true })}
                />
              </label>
            </FormInput>
            <div>
              <CustomModalButton isDisabled={isLoading}>
                CREATE
              </CustomModalButton>
            </div>
          </Form>
        ) : (
          <FormError>Can't Fetch Publication Data</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default CreatePublicationsModal;
