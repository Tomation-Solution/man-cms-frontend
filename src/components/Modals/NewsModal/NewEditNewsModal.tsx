import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { newsRetrieve, newsUpdate } from "../../../axios/api-calls";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { ModalsContainer } from "../Modals.styles";
import {
  AddMoreButton,
  CustomModalButton,
  SelectImage,
} from "../../../globals/styles/CustomFormComponents";
import Button from "../../Button/Button";

import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "../../Loading/Loading";
import { toast } from "react-toastify";
import AdvancedEditor from "../../TextEditor/AdvancedQuill";
import { containsActualText } from "../../../utils";

type detailsObj = {
  header: string;
  value: string;
};

type formInputData = {
  name: string;
  title?: string;
  link: any;
  image: any;
  details?: detailsObj[];
  newsContent?: string;
};

const schema = yup.object({
  name: yup.string().required("Name is required"),
  title: yup.string().optional(),
  link: yup.mixed().nullable(),
  image: yup.mixed().nullable(),
  details: yup
    .array(
      yup.object({
        header: yup.string().optional(),
        value: yup.string().optional(),
      })
    )
    .optional(),
  newsContent: yup.string().optional(),
});

const EditNewsModal: React.FC<{ newsId: number; closefn: () => void }> = ({
  newsId,
  closefn,
}) => {
  const queryClient = useQueryClient();
  const [newsContent, setNewsContent] = useState("");

  const {
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      title: "",
      link: "",
      newsContent: "",
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
    rules: {},
  });

  const { isLoading, isFetching, isError, data } = useQuery(
    `news-${newsId}`,
    () => newsRetrieve(newsId),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      const main_data = {
        name: data.name || "",
        title: data.title || "",
        newsContent: data.news_content || "",
        link: data.link || "",
        image: data.image || "",
        details: data.details || [],
      };
      setNewsContent(data.news_content || "");
      reset(main_data);
    }
  }, [reset, data]);

  const { mutate, isLoading: editLoading } = useMutation(newsUpdate, {
    onMutate: () => {
      toast.info("news edits saving...", {
        progressClassName: "toastProgress",
        icon: false,
      });
    },
    onSuccess: () => {
      toast.success("news edits saved", {
        progressClassName: "toastProgress",
        icon: false,
      });
      queryClient.invalidateQueries(`news-${newsId}`);
      queryClient.invalidateQueries("all-news");
      closefn();
    },
    onError: () => {
      toast.error("news not edited", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: formInputData) => {
    const FormDataHandler = new FormData();
    let { name, title, link, image, details, newsContent } = data;

    FormDataHandler.append("name", name);
    FormDataHandler.append("title", title || "");
    FormDataHandler.append("news_content", newsContent || "");

    // Handle image file
    if (image && typeof image !== "string" && image instanceof FileList) {
      FormDataHandler.append("image", image[0]); // Take the first file
    }

    // Handle link file
    if (link && typeof link !== "string" && link instanceof FileList) {
      FormDataHandler.append("link", link[0]); // Take the first file
    }

    // Handle details (ensure it’s not undefined before stringifying)
    if (details) {
      FormDataHandler.append("details", JSON.stringify(details));
    }

    // Send the data
    mutate({ newsId, FormDataHandler });
  };

  const previousImage = data?.image;
  const previousFileLink = data?.link;

  return (
    <>
      <ModalsContainer>
        {isLoading || isFetching || editLoading ? (
          <Loading light loading={isLoading || isFetching || editLoading} />
        ) : !isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Edit a News</h2>
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
              <SelectImage image={`${previousImage}`} />
              <label>
                Image
                <br />
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", { required: true })}
                />
              </label>
            </FormInput>

            {(!containsActualText(data.news_content) || data.title) && (
              <>
                <FormError>{errors?.title?.message}</FormError>
                <FormInput>
                  <label>
                    Title
                    <br />
                    <input
                      type="text"
                      {...register("title", { required: true })}
                    />
                  </label>
                </FormInput>
              </>
            )}

            <FormError>{errors?.newsContent?.message}</FormError>
            <FormInput>
              <label>News Content</label>
              <AdvancedEditor
                value={newsContent}
                onChange={(newNewsContent: string) => {
                  setNewsContent(newNewsContent);
                  setValue("newsContent", newNewsContent, {
                    shouldValidate: true,
                  });
                }}
              />
            </FormInput>

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

            {(!containsActualText(data.news_content) ||
              data?.details?.length) &&
              fields.map((fields, index) => (
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

            {(!containsActualText(data.news_content) ||
              data?.details?.length) && (
              <>
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
              </>
            )}

            <div>
              <CustomModalButton isDisabled={isLoading}>SAVE</CustomModalButton>
            </div>
          </Form>
        ) : (
          <FormError>Can't Fetch News</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default EditNewsModal;
