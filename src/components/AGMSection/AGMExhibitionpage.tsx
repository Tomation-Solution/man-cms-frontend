import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";

import {
  getExhibitionPageContent,
  updateExhibtionPageContent,
} from "../../axios/api-calls";
import { customFetcher } from "../../utils/customFetcher";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { isFileListValidator } from "../../utils/extraFunction";
import { AGMExhibitionType } from "./types";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import { SelectImage } from "../../globals/styles/CustomFormComponents";
import InputWithLabel from "../InputWithLabel/InputWithLabel";
import Button from "../Button/Button";
import TextRichEditor from "../../globals/TextRichEditor/TextRichEditor";

function AGMExhibitionpage() {
  const { loadingState, isError, data } = customFetcher<AGMExhibitionType>(
    "exhibition-details",
    getExhibitionPageContent
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{
    main_image: string;
    intro_text: string;
  }>({});

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation(updateExhibtionPageContent, {
    onSuccess: () => {
      queryClient.invalidateQueries("exhibition-details");
      toast.success("update sucessful");
    },
    onError: () => {
      toast.error("update failed");
    },
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        main_image: data?.main_image,
        intro_text: data?.intro_text,
      };

      reset(main_data);
    }
  }, [reset, data]);

  const onSubmitHandler = (inputData: {
    main_image: string | FileList;
    intro_text: string;
  }) => {
    const { main_image, ...payload } = inputData;

    const formData = new FormData();

    if (isFileListValidator(main_image)) {
      //@ts-ignore
      formData.append("main_image", main_image[0]);
    }

    //@ts-ignore
    Object.keys(payload).forEach((key) => formData.append(key, payload[key]));

    mutate(formData);
  };

  if (loadingState) {
    return <EmptyState header="loading data" />;
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

      <TextRichEditor
        header="Intro Text"
        editorState={watch("intro_text")}
        setEditorState={(e) => setValue("intro_text", e)}
      />

      <Button onClick={handleSubmit(onSubmitHandler)}>Save</Button>
    </>
  );
}

export default AGMExhibitionpage;
