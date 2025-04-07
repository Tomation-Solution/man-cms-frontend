import React, { useEffect, useState } from "react";
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
import { containsActualText, validateUnorderedListOnly } from "../../utils";
import BoxWithHeading from "../BoxWithHeading";
import AdvancedEditor from "../TextEditor/AdvancedQuill";

const schema = yup.object({
  national_secretariat: yup.string().required(),
  coorprate_office: yup.string().required(),
  branch_text: yup.string().required(),
});

const HowWeOperate = () => {
  const queryClient = useQueryClient();
  const [nationalSecretariat, setNationalSecretariat] = useState("");
  const [corporateOffice, setCorporateOffice] = useState("");
  const [branchText, setBranchText] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    setValue,
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

      setNationalSecretariat(data.national_secretariat || "");
      setCorporateOffice(data.coorprate_office || "");
      setBranchText(data.branch_text || "");
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

    let errorThrown = false;
    Object.keys(payload)?.forEach((key) => {
      if (!containsActualText(payload[key])) {
        setError(
          key as "national_secretariat" | "coorprate_office" | "branch_text",
          {
            type: "manual",
            message: "This field must not be empty.",
          }
        );
        errorThrown = true;
        return;
      }
      //@ts-ignore
      return FormDataHandler.append(key, payload[key]);
    });

    if (!errorThrown) mutate(FormDataHandler);
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

            <BoxWithHeading heading="National Secretariat*">
              <AdvancedEditor
                value={nationalSecretariat}
                onChange={(newContent: string) => {
                  setNationalSecretariat(newContent);
                  setValue("national_secretariat", newContent, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormError>{errors?.national_secretariat?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="Corporate Office*">
              <AdvancedEditor
                value={corporateOffice}
                onChange={(newContent: string) => {
                  setCorporateOffice(newContent);
                  setValue("coorprate_office", newContent, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormError>{errors?.coorprate_office?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="Branch Office*">
              <AdvancedEditor
                value={branchText}
                onChange={(newContent: string) => {
                  setBranchText(newContent);
                  setValue("branch_text", newContent, { shouldValidate: true });
                }}
              />
              <FormError>{errors?.branch_text?.message}</FormError>
            </BoxWithHeading>

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
