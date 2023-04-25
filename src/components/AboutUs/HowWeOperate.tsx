import React, { useEffect } from "react";
import { ModalsContainer } from "../Modals/Modals.styles";
import Loading from "../Loading/Loading";
import { Form, FormError, FormInput } from "../../globals/styles/forms.styles";
import {
  AddMoreButton,
  SelectImage,
} from "../../globals/styles/CustomFormComponents";
import Button from "../Button/Button";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import {
  howWeOperateRetrieve,
  howWeOperateUpdate,
} from "../../axios/api-calls";
import { toast } from "react-toastify";

const schema = yup.object({
  national_secretariat: yup.string().required(),
  coorprate_office: yup.string().required(),
  branch_text: yup.string().required(),
});

const HowWeOperate = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      main_image: null,
      national_secretariat: "",
      coorprate_office: "",
      branch_text: "",
    },
  });

  const {
    isLoading: dataLoading,
    isFetching,
    isError,
    data,
  } = useQuery("aboutus-how-we-operate", howWeOperateRetrieve, {
    refetchOnWindowFocus: false,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        main_image: data.main_image,
        national_secretariat: data.national_secretariat,
        coorprate_office: data.coorprate_office,
        branch_text: data.branch_text,
      };
      reset(main_data);
    }
  }, [reset, data]);

  const { mutate, isLoading } = useMutation(
    (data: any) => howWeOperateUpdate(data),
    {
      onMutate: () => {
        toast.info("how we operate edits saving...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("how we operate edits saved", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("aboutus-how-we-operate");
      },
      onError: () => {
        toast.error("how we operate not edited", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const onSubmitHandler = (data: any) => {
    const FormDataHandler = new FormData();

    let { main_image, ...payload } = data;

    if (
      typeof data.main_image !== "string" &&
      data.main_image instanceof FileList
    ) {
      main_image = main_image[0];
      FormDataHandler.append("main_image", main_image);
    }

    Object.keys(payload)?.forEach((key) =>
      //@ts-ignore
      FormDataHandler.append(key, payload[key])
    );

    mutate(FormDataHandler);
  };

  const previousMainCoreImage = getValues("main_image");

  return (
    <>
      <ModalsContainer>
        <Loading loading={dataLoading || isLoading || isFetching} />
        {!isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Edit Where We Operate Data</h2>
            <br />
            <FormInput>
              <SelectImage image={`${previousMainCoreImage}`} />
              <label>
                Main Image
                <br />
                <input
                  type="file"
                  accept="image/*"
                  {...register("main_image", { required: false })}
                />
              </label>
            </FormInput>

            <FormError>{errors.national_secretariat?.message}</FormError>
            <FormInput>
              <label>
                National Secretariat Text
                <br />
                <textarea
                  {...register("national_secretariat", { required: true })}
                />
              </label>
            </FormInput>

            <FormError>{errors.coorprate_office?.message}</FormError>
            <FormInput>
              <label>
                Co-operate Office Text
                <br />
                <textarea
                  {...register("coorprate_office", { required: true })}
                />
              </label>
            </FormInput>

            <FormError>{errors.branch_text?.message}</FormError>
            <FormInput>
              <label>
                Branch Office Text
                <br />
                <textarea {...register("branch_text", { required: true })} />
              </label>
            </FormInput>

            <br />
            <Button styleType="pry">EDIT</Button>
          </Form>
        ) : (
          <FormError>Can't Fetch How We Operate Data</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default HowWeOperate;
