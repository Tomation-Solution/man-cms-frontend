import React, { useState } from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { useMutation, useQueryClient } from "react-query";
import { reportsCreate } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import AdvancedEditor from "../../TextEditor/AdvancedQuill";

type formInputData = {
  name: string;
  report_content: string;
  link: string;
  readmore_link?: string;
  image: any;
};

const schema = yup.object({
  name: yup.string().required(),
  report_content: yup.string().required(),
  readmore_link: yup.string().url().notRequired(),
  link: yup.mixed().notRequired(),
  image: yup.mixed().required(),
});

const CreateReportModal: React.FC<{ closefn: () => void }> = ({ closefn }) => {
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

  const { mutate, isLoading } = useMutation(
    (data: any) => reportsCreate(data),
    {
      onMutate: () => {
        toast.info("reports creating", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
      onSuccess: () => {
        toast.success("reports created", {
          icon: false,
          progressClassName: "toastProgress",
        });
        reset();
        queryClient.invalidateQueries("all-reports");
        closefn();
      },
      onError: () => {
        toast.error("reports not created", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const onSubmitHandler = (dataInput: formInputData) => {
    let { image, link, name, report_content, readmore_link } = dataInput;

    const FormDataHandler = new FormData();

    if (image && image.length > 0) {
      FormDataHandler.append("image", image[0]);
    }

    if (link && link.length > 0) {
      FormDataHandler.append("link", link[0]);
    }

    FormDataHandler.append("name", name);
    FormDataHandler.append("report_content", report_content);
    FormDataHandler.append("readmore_link", readmore_link || "");
    setReportContent("");
    mutate(FormDataHandler);
  };

  return (
    <>
      <ModalsContainer>
        {isLoading ? (
          <Loading light loading={isLoading} />
        ) : (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Create a Report</h2>
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
                Cover Image
                <br />
                <input
                  type="file"
                  accept="image/*"
                  required
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
        )}
      </ModalsContainer>
    </>
  );
};

export default CreateReportModal;
