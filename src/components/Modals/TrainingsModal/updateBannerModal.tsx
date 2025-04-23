import React from "react";
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
  getOurMembersBanner,
  getTrainingsBanner,
  getWhyJoinBanner,
  ourMembersCreate,
  updateOurMembersBanner,
  updateTrainingsBanner,
  updateWhyJoinBanner,
} from "../../../axios/api-calls";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { toast } from "react-toastify";
import InputWithLabel from "../../InputWithLabel/InputWithLabel";

const schema = yup.object({
  banner_image: yup.mixed().required(),
});

interface InputData extends yup.InferType<typeof schema> {}

const TrainingsUpdateBanner: React.FC<{ closefn: () => void }> = ({
  closefn,
}) => {
  const { data: fetchedData } = useQuery("training-banner", getTrainingsBanner);
  console.log(fetchedData);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      banner_image: "",
    },
  });

  const { isLoading, mutate, data } = useMutation(updateTrainingsBanner, {
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
          <h2>Update Trainning Banner</h2>
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

          <div>
            <CustomModalButton isDisabled={isLoading}>Update</CustomModalButton>
          </div>
        </Form>
      </ModalsContainer>
    </>
  );
};

export default TrainingsUpdateBanner;
