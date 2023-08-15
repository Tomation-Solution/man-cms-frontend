import { getAgmHomepage, updateAgmHomepage } from "../../axios/api-calls";
import { customFetcher } from "../../utils/customFetcher";
import EmptyState from "../EmptyState/EmptyState";
import InputWithLabel from "../InputWithLabel/InputWithLabel";
import { AGMHomepageType } from "./types";
import { useForm } from "react-hook-form";
import { AGMHomepageValidator, AGMHomepageValidatorType } from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { SelectImage } from "../../globals/styles/CustomFormComponents";
import { isFileListValidator } from "../../utils/extraFunction";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";
import TextRichEditor from "../../globals/TextRichEditor/TextRichEditor";

function AGMHomepage() {
  const { loadingState, isError, data } = customFetcher<AGMHomepageType>(
    `agm-homepage`,
    getAgmHomepage
  );

  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AGMHomepageValidatorType>({
    resolver: yupResolver(AGMHomepageValidator),
  });

  useEffect(() => {
    if (data) {
      const main_data: AGMHomepageValidatorType = {
        main_image: data?.main_image,
        intro_text: data?.intro_text,
        location: data?.location,
        agm_start_date: data?.agm_start_date,
        countdown_text: data?.countdown_text,
        intro_title: data?.intro_title,
        intro_description: data?.intro_description,
        exhibition_text: data?.exhibition_text,
        exhibition_image: data?.exhibition_image,
        save_date_text: data?.save_date_text,
        save_date_image: data?.save_date_image,
        venue_text: data?.venue_text,
        venue_text_image: data?.venue_text_image,
      };

      reset(main_data);
    }
  }, [reset, data]);

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation(updateAgmHomepage, {
    onSuccess: () => {
      queryClient.invalidateQueries("agm-homepage");
      toast.success("updated successfully");
    },
    onError: () => {
      toast.error("update failed");
    },
  });

  const onSubmitHandler = (inputData: AGMHomepageValidatorType) => {
    const {
      main_image,
      save_date_image,
      exhibition_image,
      venue_text_image,
      ...payload
    } = inputData;

    const formData = new FormData();

    if (isFileListValidator(main_image)) {
      //@ts-ignore
      formData.append("main_image", main_image[0] as string);
    }
    if (isFileListValidator(save_date_image)) {
      //@ts-ignore
      formData.append("save_date_image", save_date_image[0] as string);
    }
    if (isFileListValidator(exhibition_image)) {
      //@ts-ignore
      formData.append("exhibition_image", exhibition_image[0] as string);
    }
    if (isFileListValidator(venue_text_image)) {
      //@ts-ignore
      formData.append("venue_text_image", venue_text_image[0] as string);
    }

    Object.keys(payload)?.forEach((key) =>
      //@ts-ignore
      formData.append(key, inputData[key])
    );

    mutate(formData);
  };

  if (loadingState) {
    return <EmptyState header="loading homepage data" />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        header="Oops something went wrong"
        subHeader="try again later"
      />
    );
  }

  return (
    <>
      <Loading loading={isLoading} />

      <SelectImage image={data?.main_image} />

      <InputWithLabel
        label="Main Image"
        type="file"
        accept="image/*"
        register={register("main_image")}
        errorMessage={errors.main_image?.message}
      />
      <InputWithLabel
        label="Intro Text"
        register={register("intro_text")}
        errorMessage={errors.intro_text?.message}
      />
      <InputWithLabel
        label="Location"
        register={register("location")}
        errorMessage={errors.location?.message}
      />
      <InputWithLabel
        label="AGM Start Date"
        type="date"
        register={register("agm_start_date")}
        errorMessage={errors.agm_start_date?.message}
      />

      <TextRichEditor
        header="Intro Description"
        editorState={watch("intro_description")}
        setEditorState={(e: any) => setValue("intro_description", e)}
      />

      <InputWithLabel
        label="Countdown Text"
        register={register("countdown_text")}
        errorMessage={errors.countdown_text?.message}
      />
      <InputWithLabel
        label="Intro Title"
        register={register("intro_title")}
        errorMessage={errors.intro_title?.message}
      />

      <InputWithLabel
        label="Exhibition Text"
        register={register("exhibition_text")}
        errorMessage={errors.exhibition_text?.message}
      />

      <SelectImage image={data?.exhibition_image} />

      <InputWithLabel
        label="Exhibition Image"
        type="file"
        accept="image/*"
        register={register("exhibition_image")}
        errorMessage={errors.exhibition_image?.message}
      />
      <InputWithLabel
        label="Save Date Text"
        register={register("save_date_text")}
        errorMessage={errors.save_date_text?.message}
      />

      <SelectImage image={data?.save_date_image} />
      <InputWithLabel
        label="Save Date Image"
        type="file"
        accept="image/*"
        register={register("save_date_image")}
        errorMessage={errors.save_date_image?.message}
      />
      <InputWithLabel
        label="Venue Text"
        register={register("venue_text")}
        errorMessage={errors.venue_text?.message}
      />

      <SelectImage image={data?.venue_text_image} />
      <InputWithLabel
        label="Venue Text Image"
        type="file"
        accept="image/*"
        register={register("venue_text_image")}
        errorMessage={errors.venue_text_image?.message}
      />

      <Button onClick={handleSubmit(onSubmitHandler)}>Update</Button>
    </>
  );
}

export default AGMHomepage;
