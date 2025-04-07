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
import AdvancedEditor from "../../TextEditor/AdvancedQuill";

type formInputData = {
  name: string;
  publication_content: string;
  title: string;
  link: any;
  is_paid: string;
  price: string;
  readmore_link?: string;
  type: string;
  image: any;
};

const schema = yup.object({
  name: yup.string().required(),
  publication_content: yup.string().required(),
  title: yup.string().required(),
  link: yup.mixed().notRequired(),
  image: yup.mixed().required(),
  is_paid: yup.string().required(),
  type: yup.string().required(),
  readmore_link: yup.string().url().notRequired(),
});

const EditPublicationsModal: React.FC<{ pubid: number; close: () => void }> = ({
  pubid,
  close,
}) => {
  const queryClient = useQueryClient();
  const [publicationContent, setPublicationContent] = useState("");
  const { isLoading, isFetching, data, isError } = useQuery(
    `publication-${pubid}`,
    () => publicationRetrieve(pubid),
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      publication_content: "",
      link: "",
      title: "",
      type: "",
      readmore_link: "",
      price: "",
      to_rel8: "",
      is_paid: "",
      image: null,
    },
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        name: data.name || "",
        title: data.title || "",
        publication_content: data.publication_content || "",
        link: data.link || "",
        type: data.type || "",
        price: data.price || "",
        readmore_link: data?.readmore_link,
        is_paid: data.is_paid,
        image: data.image,
      };
      setPublicationContent(data?.publication_content || "");
      reset(main_data);
    }
  }, [reset, data]);

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
    const FormDataHandler = new FormData();

    // Ensure image is a file before appending
    if (data.image instanceof FileList && data.image.length > 0) {
      FormDataHandler.append("image", data.image[0]);
    }

    // Ensure link is a file before appending
    if (data.link instanceof FileList && data.link.length > 0) {
      FormDataHandler.append("link", data.link[0]);
    }

    // Append simple fields directly
    FormDataHandler.append("name", data.name);
    FormDataHandler.append("title", data.title);
    FormDataHandler.append("publication_content", data.publication_content);
    FormDataHandler.append("is_paid", data.is_paid);
    FormDataHandler.append("type", data.type);

    // Append optional readmore_link if provided
    if (data.readmore_link) {
      FormDataHandler.append("readmore_link", data.readmore_link);
    }

    // Append price only if is_paid is "true"
    if (data.is_paid === "true" && data.price) {
      FormDataHandler.append("price", data.price);
    }

    // Send the data
    mutate({ pubid, FormDataHandler });
    setPublicationContent("");
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

              <FormError>{errors?.is_paid?.message}</FormError>
              <FormSelect>
                <label>
                  Is this a paid publication*
                  <br />
                  <small>if yes a valid price must be provided</small>
                  <br />
                  <select
                    defaultValue={"false"}
                    {...register("is_paid", { required: true })}
                  >
                    <option disabled>select an option</option>
                    <option value="true">Yes</option>
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

                    {getData
                      ? getData.map((item: { name: string; id: number }) => (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        ))
                      : null}
                  </select>
                </label>
              </FormSelect>

              <FormError>{errors?.publication_content?.message}</FormError>
              <FormInput>
                <label>Publiction Content</label>
                <AdvancedEditor
                  value={publicationContent}
                  onChange={(newPublicationContent: string) => {
                    setPublicationContent(newPublicationContent);
                    setValue("publication_content", newPublicationContent, {
                      shouldValidate: true,
                    });
                  }}
                />
              </FormInput>

              {/* <FormError>{errors?.title?.message}</FormError>
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
              </AddMoreButton> */}

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
