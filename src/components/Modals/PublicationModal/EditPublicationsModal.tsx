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
  publicationTypesGetAll,
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
import { validateFileExtension } from "../../../utils/extensionValidator";

type detailsObj = {
  header: string;
  value: string;
};

type formInputData = {
  name: string;
  title: string;
  link: any;
  is_paid: string;
  price: string;
  type: string;
  image: any;
  details: detailsObj[];
};

const schema = yup.object({
  name: yup.string().required(),
  title: yup.string().required(),
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

  const {
    isLoading: getLoading,
    isFetching: getFetching,
    isError: getError,
    data: getData,
  } = useQuery("all-publication-types", publicationTypesGetAll, {
    select: (data) => data.data,
    refetchOnWindowFocus: false,
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
      let { image, details, link, ...payload } = data;
      if (typeof data.image !== "string" && data.image instanceof FileList) {
        image = image[0];
        FormDataHandler.append("image", image);
      }
      if (typeof data.link !== "string" && data.link instanceof FileList) {
        link = link[0];
        FormDataHandler.append("link", link);
      }

      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      FormDataHandler.append("details", JSON.stringify(details));

      mutate({ pubid, FormDataHandler });
    } else {
      const FormDataHandler = new FormData();
      let { image, details, price, link, ...payload } = data;
      if (typeof data.image !== "string" && data.image instanceof FileList) {
        image = image[0];
        FormDataHandler.append("image", image);
      }
      if (typeof data.link !== "string" && data.link instanceof FileList) {
        link = link[0];
        FormDataHandler.append("link", link);
      }

      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      FormDataHandler.append("details", JSON.stringify(details));

      mutate({ pubid, FormDataHandler });
    }
  };

  const previousImage = data?.image;
  const previousFileLink = data?.link;

  return (
    <>
      <ModalsContainer>
        {isLoading || isFetching || editLoading || getLoading || getFetching ? (
          <Loading
            light
            loading={
              isLoading ||
              isFetching ||
              editLoading ||
              getLoading ||
              getFetching
            }
          />
        ) : !isError || getError ? (
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
                    {getData.map((item: { name: string; id: number }) => (
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
                      Description*
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

              <div>
                <a
                  href={previousFileLink}
                  target="_blank"
                  style={{ color: "#fff" }}
                >
                  Current File Link (click to view)
                </a>
              </div>
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
                  SAVE
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
