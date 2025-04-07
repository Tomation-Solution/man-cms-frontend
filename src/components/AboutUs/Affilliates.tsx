import React, { useEffect, useState } from "react";
import { ModalsContainer } from "../Modals/Modals.styles";
import { Form, FormError, FormInput } from "../../globals/styles/forms.styles";
import Button from "../Button/Button";
import {
  AddMoreButton,
  SelectImage,
} from "../../globals/styles/CustomFormComponents";
import { useForm, useFieldArray } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loading from "../Loading/Loading";
import { toast } from "react-toastify";
import { affilliatesRetrieve, affilliatesUpdate } from "../../axios/api-calls";
import { containsActualText, validateUnorderedListOnly } from "../../utils";
import BoxWithHeading from "../BoxWithHeading";
import AdvancedEditor from "../TextEditor/AdvancedQuill";

const schema = yup.object({
  international_partners: yup.string().required(),
  ops: yup.string().required(),
});

const Affilliates = () => {
  const queryClient = useQueryClient();
  const [internationalPartners, setInternationalPartners] = useState("");
  const [ops, setOps] = useState("");

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
      ops: "",
      international_partners: "",
    },
  });

  const {
    isLoading: dataLoading,
    isFetching,
    isError,
    data,
  } = useQuery("aboutus-advocacy", affilliatesRetrieve, {
    refetchOnWindowFocus: false,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        main_image: data.main_image,
        ops: data.ops,
        international_partners: data.international_partners,
      };
      setInternationalPartners(data?.international_partners || "");
      setOps(data?.ops || "");
      reset(main_data);
    }
  }, [reset, data]);

  const { mutate, isLoading } = useMutation(
    (data: any) => affilliatesUpdate(data),
    {
      onMutate: () => {
        toast.info("affilliates edits saving...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("affilliates edits saved", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("aboutus-affilliates");
      },
      onError: () => {
        toast.error("affilliates not edited", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const onSubmitHandler = (data: any) => {
    console.log(data);

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
      if (
        (key === "ops" || key === "international_partners") &&
        !validateUnorderedListOnly(payload[key])
      ) {
        setError(key as "ops" | "international_partners", {
          type: "manual",
          message: "Must be an unordered list.",
        });
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
            <h2>Edit Affilliates Data</h2>
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

            <BoxWithHeading heading="International Partners Paragraphs*">
              <AdvancedEditor
                onlyList
                value={internationalPartners}
                onChange={(newContent: string) => {
                  setInternationalPartners(newContent);
                  setValue("international_partners", newContent, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormError>{errors?.international_partners?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="Organized Private Sector Paragraphs*">
              <AdvancedEditor
                onlyList
                value={ops}
                onChange={(newContent: string) => {
                  setOps(newContent);
                  setValue("ops", newContent, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormError>{errors?.ops?.message}</FormError>
            </BoxWithHeading>

            <br />
            <Button styleType="pry">EDIT</Button>
          </Form>
        ) : (
          <FormError>Can't Fetch Affilliates Data</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default Affilliates;
