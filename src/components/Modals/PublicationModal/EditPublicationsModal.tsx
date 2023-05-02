import React, { useEffect, useState } from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
  FormSelect,
} from "../../../globals/styles/forms.styles";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  publicationRetrieve,
  publicationUpdate,
} from "../../../axios/api-calls";

import Loading from "../../Loading/Loading";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray } from "react-hook-form";
import Button from "../../Button/Button";
import {
  AddMoreButton,
  CustomModalButton,
  SelectImage,
} from "../../../globals/styles/CustomFormComponents";
import { toast } from "react-toastify";

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
  link: yup.string().url().required(),
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

const EditPublicationsModal: React.FC<{ pubid: number; close: () => void }> = ({
  pubid,
  close,
}) => {
  const queryClient = useQueryClient();

  const { isLoading, isFetching, data, isError } = useQuery(
    `publication-${pubid}`,
    () => publicationRetrieve(pubid),
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    handleSubmit,
    control,
    register,
    reset,
    getValues,
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

  useEffect(() => {
    if (data) {
      const main_data = {
        name: data.name,
        title: data.title,
        link: data.link,
        type: data.type,
        price: data.price,
        is_paid: data.is_paid,
        image: data.image,
        details: data.details,
      };
      reset(main_data);
    }
  }, [reset, data]);

  const { fields, append, remove } = useFieldArray({
    name: "details",
    control,
    rules: {
      required: "Please add atleast one header value pair",
    },
  });

  const { mutate, isLoading: editLoading } = useMutation(
    (data: any) => publicationUpdate(data),
    {
      onMutate: () => {
        toast.info("publication edits saving...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("publication edits saved", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries(`publication-${pubid}`);
        queryClient.invalidateQueries("all-publication");
        close();
      },
      onError: () => {
        toast.error("publication not edited", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const onSubmitHandler = (data: formInputData) => {
    if (data.is_paid === "true") {
      const FormDataHandler = new FormData();
      let { image, details, ...payload } = data;
      if (typeof data.image !== "string" && data.image instanceof FileList) {
        image = image[0];
        FormDataHandler.append("image", image);
      }

      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      FormDataHandler.append("details", JSON.stringify(details));

      mutate({ pubid, FormDataHandler });
    } else {
      const FormDataHandler = new FormData();
      let { image, details, price, ...payload } = data;
      if (typeof data.image !== "string" && data.image instanceof FileList) {
        image = image[0];
        FormDataHandler.append("image", image);
      }

      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      FormDataHandler.append("details", JSON.stringify(details));

      mutate({ pubid, FormDataHandler });
    }
  };

  const previousImage = getValues("image");

  return (
    <>
      <ModalsContainer>
        {isLoading || isFetching || editLoading ? (
          <Loading light loading={isLoading || isFetching || editLoading} />
        ) : !isError ? (
          <>
            <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <h2>Edit a Publication</h2>
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
                <SelectImage image={`${previousImage}`} />
                <label>
                  Image*
                  <br />
                  <input
                    type={"file"}
                    accept="image/*"
                    style={{ backgroundColor: "#fff", color: "#000" }}
                    {...register("image", { required: true })}
                  />
                </label>
              </FormInput>

              <FormError>{errors?.is_paid?.message}</FormError>
              <FormSelect>
                <label>
                  Is Paid Publication*
                  <br />
                  <small>if true a valid price must be provided</small>
                  <br />
                  <select
                    defaultValue={"false"}
                    {...register("is_paid", { required: true })}
                  >
                    <option disabled>select an option</option>
                    <option value="true">True</option>
                    <option value="false">No</option>
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
                    <option value={"OTHERS"}>OTHERS</option>
                    <option value={"MAGAZINE"}>MAGAZINE</option>
                    <option value={"MCCI"}>MCCI</option>
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
                Add More or Show All
              </AddMoreButton>

              <FormError>{errors?.link?.message}</FormError>
              <FormInput>
                <label>
                  Read More Link*
                  <br />
                  <input
                    type={"text"}
                    style={{ backgroundColor: "#fff" }}
                    {...register("link", { required: true })}
                  />
                </label>
              </FormInput>
              <div>
                <CustomModalButton isDisabled={isLoading}>
                  EDIT
                </CustomModalButton>
              </div>
            </Form>
          </>
        ) : (
          <FormError>Cant Fetch Publication</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default EditPublicationsModal;
