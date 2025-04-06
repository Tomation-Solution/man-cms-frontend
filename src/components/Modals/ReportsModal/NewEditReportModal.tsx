import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  newsRetrieve,
  newsUpdate,
  reportsRetrieve,
  reportsUpdate,
} from "../../../axios/api-calls";
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

type formInputData = {
  name: string;
  report_content: string;
  link: any;
  readmore_link?: string;
  image: any;
};

const schema = yup.object({
  name: yup.string().required(),
  report_content: yup.string().optional(),
  readmore_link: yup.string().url().optional(),
  link: yup.mixed().optional(),
  image: yup.mixed().optional(),
});

const EditReportModal: React.FC<{ reportId: number; closefn: () => void }> = ({
  reportId,
  closefn,
}) => {
  const queryClient = useQueryClient();
  const [reportContent, setReportContent] = useState("");

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
      report_content: "",
      link: "",
      readmore_link: "",
      image: null,
    },
  });

  const { isLoading, isFetching, isError, data } = useQuery(
    `report-${reportId}`,
    () => reportsRetrieve(reportId),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      const main_data = {
        name: data.name || "",
        report_content: data.report_content || "",
        link: data.link || "",
        readmore_link: data?.readmore_link || "",
        image: data.image || "",
      };
      setReportContent(data.report_content || "");
      reset(main_data);
    }
  }, [reset, data]);

  const { mutate, isLoading: editLoading } = useMutation(reportsUpdate, {
    onMutate: () => {
      toast.info("reports edits saving...", {
        progressClassName: "toastProgress",
        icon: false,
      });
    },
    onSuccess: () => {
      toast.success("reports edits saved", {
        progressClassName: "toastProgress",
        icon: false,
      });
      queryClient.invalidateQueries(`report-${reportId}`);
      queryClient.invalidateQueries("all-reports");
      closefn();
    },
    onError: () => {
      toast.error("reports not edited", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (dataInput: formInputData) => {
    let { image, link, name, report_content, readmore_link } = dataInput;

    const FormDataHandler = new FormData();

    // Handle image file
    if (image && typeof image !== "string" && image instanceof FileList) {
      FormDataHandler.append("image", image[0]); // Take the first file
    }

    // Handle link file
    if (link && typeof link !== "string" && link instanceof FileList) {
      FormDataHandler.append("link", link[0]); // Take the first file
    }

    FormDataHandler.append("name", name);
    if (report_content)
      FormDataHandler.append("report_content", report_content);
    if (readmore_link)
      FormDataHandler.append("readmore_link", readmore_link || "");

    mutate({ reportId, FormDataHandler });
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
            <h2>Edit a Report</h2>
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

            <FormError>{errors?.report_content?.message}</FormError>
            <FormInput>
              <label>Report Content</label>
              <AdvancedEditor
                value={reportContent}
                onChange={(newReportContent: string) => {
                  setReportContent(newReportContent);
                  setValue("report_content", newReportContent, {
                    shouldValidate: true,
                  });
                }}
              />
            </FormInput>

            <FormError>{errors?.readmore_link?.message}</FormError>
            <FormInput>
              <label>
                Readmore Link
                <br />
                <input
                  type={"url"}
                  style={{ backgroundColor: "#fff" }}
                  {...register("readmore_link")}
                />
              </label>
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

export default EditReportModal;
