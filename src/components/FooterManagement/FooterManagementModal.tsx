import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Form, FormInput, FormError } from "../../globals/styles/forms.styles";
import { SelectImage } from "../../globals/styles/CustomFormComponents";
import { updateFooterContent } from "../../axios/api-calls";
import Loading from "../Loading/Loading";
import Button from "../Button/Button";
import { FooterContentType } from "./types";

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
  company_name: yup.string().required("Company name is required"),
  address: yup.string().required("Address is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  webmail_url: yup.string().url("Invalid URL"),
  branch_network_url: yup.string(),
  services_url: yup.string(),
  facebook_url: yup.string().url("Invalid URL"),
  linkedin_url: yup.string().url("Invalid URL"),
  twitter_url: yup.string().url("Invalid URL"),
  instagram_url: yup.string().url("Invalid URL"),
  youtube_url: yup.string().url("Invalid URL"),
  logo: yup.mixed(),
});

interface FooterManagementModalProps {
  footerData?: FooterContentType;
  closefn: () => void;
}

const FooterManagementModal: React.FC<FooterManagementModalProps> = ({
  footerData,
  closefn,
}) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      company_name: "",
      address: "",
      email: "",
      phone: "",
      webmail_url: "",
      branch_network_url: "",
      services_url: "",
      facebook_url: "",
      linkedin_url: "",
      twitter_url: "",
      instagram_url: "",
      youtube_url: "",
      logo: null,
    },
  });

  useEffect(() => {
    if (footerData) {
      const fields = {
        company_name: footerData.company_name || "",
        address: footerData.address || "",
        email: footerData.email || "",
        phone: footerData.phone || "",
        webmail_url: footerData.webmail_url || "",
        branch_network_url: footerData.branch_network_url || "",
        services_url: footerData.services_url || "",
        facebook_url: footerData.facebook_url || "",
        linkedin_url: footerData.linkedin_url || "",
        twitter_url: footerData.twitter_url || "",
        instagram_url: footerData.instagram_url || "",
        youtube_url: footerData.youtube_url || "",
        logo: footerData.logo || null,
      };
      reset(fields);
    }
  }, [footerData, reset]);

  const { mutate, isLoading: editLoading } = useMutation(updateFooterContent, {
    onMutate: () => {
      toast.info("Saving footer updates...", { icon: false });
    },
    onSuccess: () => {
      toast.success("Footer content updated successfully!");
      queryClient.invalidateQueries(["footer-content"]);
      closefn();
    },
    onError: () => {
      toast.error("Footer update failed");
    },
  });

  const onSubmitHandler = (input: any) => {
    const formData = new FormData();

    // Append text fields
    formData.append("company_name", input.company_name);
    formData.append("address", input.address);
    formData.append("email", input.email);
    formData.append("phone", input.phone);
    formData.append("webmail_url", input.webmail_url || "");
    formData.append("branch_network_url", input.branch_network_url || "");
    formData.append("services_url", input.services_url || "");
    formData.append("facebook_url", input.facebook_url || "");
    formData.append("linkedin_url", input.linkedin_url || "");
    formData.append("twitter_url", input.twitter_url || "");
    formData.append("instagram_url", input.instagram_url || "");
    formData.append("youtube_url", input.youtube_url || "");

    // Handle logo upload
    if (input.logo && typeof input.logo !== "string") {
      formData.append("logo", input.logo[0]);
    }

    mutate(formData);
  };

  return (
    <div onClick={() => closefn()} style={modalOverlayStyle}>
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        style={modalContentStyle}
      >
        {editLoading ? (
          <Loading loading={true} />
        ) : (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2 style={{ color: "#2b3513" }}>Edit Footer Content</h2>

            {/* Logo Upload */}
            <FormError>{errors?.logo?.message}</FormError>
            <FormInput>
              <SelectImage image={footerData?.logo} />
              <label>Upload Logo</label>
              <input type="file" accept="image/*" {...register("logo")} />
            </FormInput>

            {/* Company Name */}
            <FormError>{errors?.company_name?.message}</FormError>
            <FormInput>
              <label>Company Name *</label>
              <input type="text" {...register("company_name")} />
            </FormInput>

            {/* Address */}
            <FormError>{errors?.address?.message}</FormError>
            <FormInput>
              <label>Address *</label>
              <textarea
                rows={3}
                {...register("address")}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </FormInput>

            {/* Email */}
            <FormError>{errors?.email?.message}</FormError>
            <FormInput>
              <label>Email *</label>
              <input type="email" {...register("email")} />
            </FormInput>

            {/* Phone */}
            <FormError>{errors?.phone?.message}</FormError>
            <FormInput>
              <label>Phone *</label>
              <input type="text" {...register("phone")} />
            </FormInput>

            {/* Webmail URL */}
            <FormError>{errors?.webmail_url?.message}</FormError>
            <FormInput>
              <label>Webmail URL</label>
              <input type="url" {...register("webmail_url")} />
            </FormInput>

            {/* Branch Network URL */}
            <FormError>{errors?.branch_network_url?.message}</FormError>
            <FormInput>
              <label>Branch Network URL</label>
              <input type="text" {...register("branch_network_url")} />
            </FormInput>

            {/* Services URL */}
            <FormError>{errors?.services_url?.message}</FormError>
            <FormInput>
              <label>Services URL</label>
              <input type="text" {...register("services_url")} />
            </FormInput>

            <h3 style={{ color: "#2b3513", margin: "20px 0 10px 0" }}>
              Social Media Links
            </h3>

            {/* Facebook URL */}
            <FormError>{errors?.facebook_url?.message}</FormError>
            <FormInput>
              <label>Facebook URL</label>
              <input type="url" {...register("facebook_url")} />
            </FormInput>

            {/* LinkedIn URL */}
            <FormError>{errors?.linkedin_url?.message}</FormError>
            <FormInput>
              <label>LinkedIn URL</label>
              <input type="url" {...register("linkedin_url")} />
            </FormInput>

            {/* Twitter URL */}
            <FormError>{errors?.twitter_url?.message}</FormError>
            <FormInput>
              <label>Twitter URL</label>
              <input type="url" {...register("twitter_url")} />
            </FormInput>

            {/* Instagram URL */}
            <FormError>{errors?.instagram_url?.message}</FormError>
            <FormInput>
              <label>Instagram URL</label>
              <input type="url" {...register("instagram_url")} />
            </FormInput>

            {/* YouTube URL */}
            <FormError>{errors?.youtube_url?.message}</FormError>
            <FormInput>
              <label>YouTube URL</label>
              <input type="url" {...register("youtube_url")} />
            </FormInput>

            <Button>SAVE</Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default FooterManagementModal;
