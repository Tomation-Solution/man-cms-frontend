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
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getServiceBanner,
  updateServiceBanner,
} from "../../../axios/api-calls";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { toast } from "react-toastify";
import InputWithLabel from "../../InputWithLabel/InputWithLabel";
import AdvancedEditor from "../../TextEditor/AdvancedQuill";
import BoxWithHeading from "../../BoxWithHeading";
import { m } from "framer-motion";

const schema = yup.object({
  banner_image: yup.mixed().required(),
  mrc_desc: yup.string().required(),
  mpdcl_desc: yup.string().required(),
  core_desc: yup.string().required(),
});

interface InputData extends yup.InferType<typeof schema> {}

const ServiceUpdateBanner: React.FC<{ closefn: () => void }> = ({
  closefn,
}) => {
  const [mrcDesc, setMrcDesc] = useState("");
  const [mpdclDesc, setMpdclDesc] = useState("");
  const [coreDesc, setCoreDesc] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      banner_image: "",
      mrc_desc: "",
      mpdcl_desc: "",
      core_desc: "",
    },
  });

  const { data: fetchedData } = useQuery("service-banner", getServiceBanner, {
    onSuccess: (data) => {
      console.log("Fetched data: ", data);
      if (data) {
        setValue("banner_image", data.banner_image);
        setValue("mrc_desc", data.mrc_desc);
        setValue("mpdcl_desc", data.mpdcl_desc);
        setValue("core_desc", data.core_desc);

        setMrcDesc(data.mrc_desc);
        setMpdclDesc(data.mpdcl_desc);
        setCoreDesc(data.core_desc);
      }
    },
  });

  const { isLoading, mutate, data } = useMutation(updateServiceBanner, {
    onMutate: () => {
      toast.info("Updating Banner", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("Banner Updated", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      // queryClient.invalidateQueries("all-members");
      closefn();
    },
    onError: () => {
      toast.error("Banner not updated", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: InputData) => {
    mutate(data);
  };

  return (
    <>
      <ModalsContainer>
        <Form onSubmit={handleSubmit(onSubmitHandler)}>
          <h2>Update Event Banner</h2>
          <br />
          <FormError>{errors?.banner_image?.message}</FormError>
          <FormInput>
            <div style={{ margin: "0 10px" }}>
              <img
                src={data?.banner_image ?? ""}
                style={{ width: "75px", aspectRatio: "16/7" }}
                alt=""
              />
              <InputWithLabel
                register={register("banner_image")}
                label="Banner Images (Aspect Ratio 16:7)"
                type="file"
              />
            </div>
          </FormInput>

          <BoxWithHeading heading="MRC Description">
            <AdvancedEditor
              value={mrcDesc}
              onChange={(newContent: string) => {
                setMrcDesc(newContent);
                setValue("mrc_desc", newContent, {
                  shouldValidate: true,
                });
              }}
            />
          </BoxWithHeading>

          <BoxWithHeading heading="MPDCL Description">
            <AdvancedEditor
              value={mpdclDesc}
              onChange={(newContent: string) => {
                setMpdclDesc(newContent);
                setValue("mpdcl_desc", newContent, {
                  shouldValidate: true,
                });
              }}
            />
          </BoxWithHeading>

          <BoxWithHeading heading="Core Description">
            <AdvancedEditor
              value={coreDesc}
              onChange={(newContent: string) => {
                setCoreDesc(newContent);
                setValue("core_desc", newContent, {
                  shouldValidate: true,
                });
              }}
            />
          </BoxWithHeading>

          <div>
            <CustomModalButton isDisabled={isLoading}>Update</CustomModalButton>
          </div>
        </Form>
      </ModalsContainer>
    </>
  );
};

export default ServiceUpdateBanner;
