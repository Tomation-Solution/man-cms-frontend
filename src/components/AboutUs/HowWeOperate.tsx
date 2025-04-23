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
import InputWithLabel from "../InputWithLabel/InputWithLabel";

const schema = yup.object({
  national_secretariat_header: yup.string(),
  national_secretariat: yup.string(),
  coorprate_office_header: yup.string(),
  coorprate_office: yup.string(),
  branch_text_header: yup.string(),
  branch_text: yup.string(),
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
      national_secretariat_header: "",
      national_secretariat: "",
      coorprate_office_header: "",
      coorprate_office: "",
      branch_text_header: "",
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
        national_secretariat_header: data.national_secretariat_header,
        national_secretariat: data.national_secretariat,
        coorprate_office_header: data.coorprate_office_header,
        coorprate_office: data.coorprate_office,
        branch_text_header: data.branch_text_header,
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
      // if (!containsActualText(payload[key])) {
      //   setError(
      //     key as "national_secretariat" | "coorprate_office" | "branch_text",
      //     {
      //       type: "manual",
      //       message: "This field must not be empty.",
      //     }
      //   );
      //   errorThrown = true;
      //   return;
      // }
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
            <small>
              PS: If a section's header is not filled it will be omited from the
              website
            </small>
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
              <InputWithLabel
                label={"Header"}
                register={register("national_secretariat_header")}
              />
              <br />
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
              <InputWithLabel
                label={"Header"}
                register={register("coorprate_office_header")}
              />
              <br />
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
              <InputWithLabel
                label={"Header"}
                register={register("branch_text_header")}
              />
              <br />
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
            {Object.keys(errors).length > 0 && (
              <FormError>
                {Object.entries(errors).map(([key, error]) => (
                  <div key={key}>{error?.message}</div>
                ))}
              </FormError>
            )}
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
