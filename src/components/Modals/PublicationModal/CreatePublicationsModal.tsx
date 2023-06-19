import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  AddMoreButton,
  CustomModalButton,
} from "../../../globals/styles/CustomFormComponents";
import {
  Form,
  FormError,
  FormHalveInput,
  FormInput,
  FormRadio,
  FormSelect,
  Header,
} from "../../../globals/styles/forms.styles";
import Button from "../../Button/Button";
import { ModalsContainer } from "../Modals.styles";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  publicationCreate,
  publicationTypesGetAll,
  rel8Publication,
} from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import { validateFileExtension } from "../../../utils/extensionValidator";
import useRel8AuthStore from "../../../zustand/rel8-store";
import Rel8LoginModal from "../Rel8LoginModal";

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
  readmore_link: string;
  to_rel8: string;
  type: string;
  image: any;
  details: detailsObj[];
};

const schema = yup.object({
  name: yup.string().required(),
  title: yup.string().required(),
  link: yup.mixed().notRequired(),
  image: yup.mixed().required(),
  is_paid: yup.string().required(),
  type: yup.string().required(),
  readmore_link: yup.string().url().notRequired(),
  to_rel8: yup.string().required("please select an option"),
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
  const [loginModal, setLoginModal] = useState(false);
  const rel8UserData = useRel8AuthStore.getState().user;

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
      readmore_link: "",
      price: "",
      to_rel8: "",
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

  const { mutateAsync, isLoading } = useMutation(
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

  const rel8PubMutResult = useMutation(rel8Publication, {
    onMutate: () => {
      toast.info("posting publication to Rel8");
    },
    onError: () => {
      toast.error("failed to post publication to Rel8");
    },
    onSuccess: () => {
      toast.success("publication posted on Rel8");
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "details",
    control,
    rules: {
      required: "Please add atleast one header value pair",
    },
  });

  const onSubmitHandler = async (dataInput: formInputData) => {
    let { to_rel8, ...data } = dataInput;
    if (to_rel8 === "yes") {
      if (!rel8UserData?.token) {
        setLoginModal(true);
        return null;
      } else {
        const rel8FormData = new FormData();
        rel8FormData.append("name", data.name);
        rel8FormData.append("is_exco", "false");
        rel8FormData.append("is_committe", "false");
        rel8FormData.append("body", data.title);
        const rel8PubParagraph = data.details.map((item) => ({
          heading: item.header,
          paragragh: item.value,
        }));
        rel8FormData.append(
          "publication_paragraph",
          JSON.stringify(rel8PubParagraph)
        );
        rel8FormData.append("image", data.image[0]);
        rel8FormData.append("is_paid", data.is_paid);
        rel8FormData.append("amount", `${data.price ? data.price : "0.00"}`);
        rel8FormData.append("danload", data.link[0]);
        rel8PubMutResult.mutateAsync(rel8FormData);
      }
    }

    if (data.is_paid == "true") {
      let { image, details, link, ...payload } = data;
      image = image[0];

      const FormDataHandler = new FormData();
      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      FormDataHandler.append("image", image);
      if ((link as unknown as FileList).length > 0) {
        link = link[0];
        FormDataHandler.append("link", link);
      }
      FormDataHandler.append("details", JSON.stringify(details));

      mutateAsync(FormDataHandler);
    } else {
      let { image, details, price, link, ...payload } = data;
      image = image[0];

      const FormDataHandler = new FormData();
      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      FormDataHandler.append("image", image);
      if ((link as unknown as FileList).length > 0) {
        link = link[0];
        FormDataHandler.append("link", link);
      }
      FormDataHandler.append("details", JSON.stringify(details));

      mutateAsync(FormDataHandler);
    }
  };
  return (
    <>
      {loginModal && <Rel8LoginModal closefn={() => setLoginModal(false)} />}
      {!loginModal && (
        <ModalsContainer>
          {isLoading ||
          getLoading ||
          isFetching ||
          rel8PubMutResult.isLoading ? (
            <Loading
              light
              loading={
                isLoading ||
                getLoading ||
                isFetching ||
                rel8PubMutResult.isLoading
              }
            />
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
                Add More
              </AddMoreButton>

              <FormError>{errors?.link?.message}</FormError>
              <FormInput>
                <label>
                  Upload File
                  <br />
                  <small>
                    max file size of 5mb, if large files are to be used upload
                    should be done manually and the link is to be provided in
                    the read moe link field
                  </small>
                  <br />
                  <input
                    type={"file"}
                    accept=".doc,.docx,.odt,.pdf,.xls,.xlsx,.ppt,.pptx,.txt,.ods"
                    style={{ backgroundColor: "#fff" }}
                    {...register("link")}
                  />
                </label>
              </FormInput>

              <FormError>{errors?.readmore_link?.message}</FormError>
              <FormInput>
                <label>
                  Read More Link
                  <br />
                  <small>for free publications only</small>
                  <br />
                  <input
                    type={"url"}
                    style={{ backgroundColor: "#fff" }}
                    {...register("readmore_link")}
                  />
                </label>
              </FormInput>

              <section>
                <Header>
                  <h3>Also create this publication on rel8?</h3>
                </Header>
                <FormError>{errors.to_rel8?.message}</FormError>
                <FormHalveInput>
                  <FormRadio>
                    <label>
                      Yes
                      <input
                        type="radio"
                        {...register("to_rel8")}
                        value={"yes"}
                      />
                    </label>
                  </FormRadio>

                  <FormRadio>
                    <label>
                      No
                      <input
                        type="radio"
                        {...register("to_rel8")}
                        value={"no"}
                      />
                    </label>
                  </FormRadio>
                </FormHalveInput>
              </section>

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
      )}
    </>
  );
};

export default CreatePublicationsModal;
