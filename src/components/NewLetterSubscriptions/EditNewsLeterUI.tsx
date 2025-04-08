import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Form, FormInput, FormError } from "../../globals/styles/forms.styles";
import { SelectImage } from "../../globals/styles/CustomFormComponents";
import { newsletterUIGet, updateNewsletterUI } from "../../axios/api-calls";
import Loading from "../Loading/Loading";
import AdvancedEditor from "../TextEditor/AdvancedQuill";
import Button from "../Button/Button";

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "350px",
  maxWidth: "750px",
  maxHeight: "90vh",
  overflowY: "auto",
};

const schema = yup.object().shape({
  header: yup.string().required("Header is required"),
  description: yup.string().required("Description is required"),
  btn_text: yup.string().required("Button text is required"),
  form_image: yup.mixed().required("Image is required"),
});

const EditNewsletterUIModal: React.FC<{ closefn: () => void }> = ({
  closefn,
}) => {
  const queryClient = useQueryClient();
  const [editorContent, setEditorContent] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      header: "",
      description: "",
      btn_text: "",
      form_image: null,
    },
  });

  const { data, isLoading, isFetching, isError } = useQuery(
    "newsletter-ui",
    newsletterUIGet,
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (data) {
      const fields = {
        header: data.header || "",
        description: data.description || "",
        btn_text: data.btn_text || "",
        form_image: data.form_image || null,
      };
      setEditorContent(data.description || "");
      reset(fields);
    }
  }, [data, reset]);

  const { mutate, isLoading: editLoading } = useMutation(updateNewsletterUI, {
    onMutate: () => {
      toast.info("Saving UI updates...", { icon: false });
    },
    onSuccess: () => {
      toast.success("Newsletter UI updated");
      queryClient.invalidateQueries("newsletter-ui");
      closefn();
    },
    onError: () => {
      toast.error("Update failed");
    },
  });

  const onSubmitHandler = (input: any) => {
    const formData = new FormData();

    formData.append("header", input.header);
    formData.append("btn_text", input.btn_text);
    formData.append("description", input.description);

    if (input.form_image && typeof input.form_image !== "string") {
      formData.append("form_image", input.form_image[0]);
    }

    mutate({ formData });
  };

  return (
    <div onClick={() => closefn()} style={modalOverlayStyle}>
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        style={modalContentStyle}
      >
        {isLoading || isFetching || editLoading ? (
          <Loading loading={true} />
        ) : (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2 style={{ color: "#2b3513" }}>Edit Newsletter UI</h2>

            <FormError>{errors?.header?.message}</FormError>
            <FormInput>
              <label>Header</label>
              <input type="text" {...register("header")} />
            </FormInput>

            <FormError>{errors?.form_image?.message}</FormError>
            <FormInput>
              <SelectImage image={data?.form_image} />
              <label>Upload Form Image</label>
              <input type="file" accept="image/*" {...register("form_image")} />
            </FormInput>

            <FormError>{errors?.description?.message}</FormError>
            <FormInput>
              <label>Description</label>
              <AdvancedEditor
                value={editorContent}
                onChange={(val: string) => {
                  setEditorContent(val);
                  setValue("description", val, { shouldValidate: true });
                }}
              />
            </FormInput>

            <FormError>{errors?.btn_text?.message}</FormError>
            <FormInput>
              <label>Button Text</label>
              <input type="text" {...register("btn_text")} />
            </FormInput>

            <Button>SAVE</Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default EditNewsletterUIModal;
