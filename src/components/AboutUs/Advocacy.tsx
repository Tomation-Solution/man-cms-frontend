import React, { useEffect, useState } from "react";
import { ModalsContainer } from "../Modals/Modals.styles";
import { Form, FormError, FormInput } from "../../globals/styles/forms.styles";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useForm, useFieldArray } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AddMoreButton,
  SelectImage,
} from "../../globals/styles/CustomFormComponents";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import { advocacyRetrieve, advocacyUpdate } from "../../axios/api-calls";
import Loading from "../Loading/Loading";
import BoxWithHeading from "../BoxWithHeading";
import AdvancedEditor from "../TextEditor/AdvancedQuill";
import { validateUnorderedListOnly } from "../../utils";

const schema = yup.object({
  main_achievements: yup.string().required(),
});

const Advocacy = () => {
  const queryClient = useQueryClient();
  const [mainAchievements, setMainAcheivements] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      main_image: null,
      main_achievements: "",
    },
  });

  const {
    isLoading: advocacyLoading,
    isFetching,
    isError,
    data,
  } = useQuery("aboutus-advocacy", advocacyRetrieve, {
    refetchOnWindowFocus: false,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        main_image: data.main_image,
        main_achievements: data.main_achievements,
      };
      setMainAcheivements(data?.main_achievements || "");
      reset(main_data);
    }
  }, [reset, data]);

  const { mutate, isLoading } = useMutation(
    (data: any) => advocacyUpdate(data),
    {
      onMutate: () => {
        toast.info("advocacy edits saving...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("advocacy edits saved", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("aboutus-advocacy");
      },
      onError: () => {
        toast.error("advocacy not edited", {
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
        key === "main_achievements" &&
        !validateUnorderedListOnly(payload[key])
      ) {
        setError(key as "main_achievements", {
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
        <Loading loading={advocacyLoading || isLoading || isFetching} />
        {!isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Edit Advocacy Data</h2>
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

            <BoxWithHeading heading="Advocacy Paragraphs*">
              <AdvancedEditor
                onlyList
                value={mainAchievements}
                onChange={(newContent: string) => {
                  setMainAcheivements(newContent);
                  setValue("main_achievements", newContent, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormError>{errors?.main_achievements?.message}</FormError>
            </BoxWithHeading>

            <br />
            <Button styleType="pry">EDIT</Button>
          </Form>
        ) : (
          <FormError>Can't Fetch Advocacy Data</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default Advocacy;
