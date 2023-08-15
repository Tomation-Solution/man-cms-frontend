import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import {
  AGMSpeakerValidator,
  AGMSpeakerValidatorType,
} from "../../AGMSection/validation";
import InputWithLabel from "../../InputWithLabel/InputWithLabel";
import Loading from "../../Loading/Loading";
import { useMutation, useQueryClient } from "react-query";
import { customFetcher } from "../../../utils/customFetcher";
import { retrieveAgmSpeaker, updateAgmSpeaker } from "../../../axios/api-calls";
import EmptyState from "../../EmptyState/EmptyState";
import Button from "../../Button/Button";
import { toast } from "react-toastify";
import { SelectImage } from "../../../globals/styles/CustomFormComponents";
import { AGMSpeakerType } from "../../AGMSection/types";
import { useEffect } from "react";
import TextRichEditor from "../../../globals/TextRichEditor/TextRichEditor";
import { isFileListValidator } from "../../../utils/extraFunction";

type Props = {
  itemId: any;
  closefn: () => void;
};

function EditAGMSpeaker({ itemId, closefn }: Props) {
  const { loadingState, isError, data } = customFetcher<AGMSpeakerType>(
    `speaker-${itemId}`,
    () => retrieveAgmSpeaker(itemId),
    (data) => data
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AGMSpeakerValidatorType>({
    resolver: yupResolver(AGMSpeakerValidator),
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        intro_text: data?.intro_text,
        header: data?.header,
        speaker_title: data?.speaker_title,
        speaker_name: data?.speaker_name,
        extra_title: data?.extra_title,
        speaker_image: data?.speaker_image,
        speaker_words: data?.speaker_words,
      };

      reset(main_data);
    }
  }, [reset, data]);

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation(updateAgmSpeaker, {
    onSuccess: () => {
      queryClient.invalidateQueries("all-speaker");
      toast.success("updated successfully");
      closefn();
    },
    onError: () => {
      toast.error("failed update");
    },
  });

  const onSubmitHandler = (inputData: AGMSpeakerValidatorType) => {
    const { speaker_image, ...payload } = inputData;

    const formData = new FormData();

    if (isFileListValidator(speaker_image)) {
      //@ts-ignore
      formData.append("speaker_image", speaker_image[0]);
    }

    //@ts-ignore
    Object.keys(payload).forEach((key) => formData.append(key, payload[key]));

    mutate({ id: itemId, formData });
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
      <InputWithLabel
        label="Speaker Name"
        register={register("speaker_name")}
        errorMessage={errors?.speaker_name?.message}
      />

      <InputWithLabel
        label="Speaker Title"
        register={register("speaker_title")}
        errorMessage={errors?.speaker_title?.message}
      />

      <SelectImage image={data?.speaker_image} />

      <InputWithLabel
        label="Speaker Image"
        type="file"
        accept="image/*"
        register={register("speaker_image")}
        errorMessage={errors?.speaker_image?.message}
      />

      <TextRichEditor
        header="Speaker Words"
        editorState={watch("speaker_words")}
        setEditorState={(e) => setValue("speaker_words", e)}
      />

      <InputWithLabel
        label="Speakers Role (guest speak; Chief Host etc)"
        register={register("intro_text")}
        errorMessage={errors?.speaker_name?.message}
      />

      <InputWithLabel
        label="Other titles"
        register={register("extra_title")}
        errorMessage={errors?.extra_title?.message}
      />

      <InputWithLabel
        label="Speaker details header"
        register={register("header")}
        errorMessage={errors?.header?.message}
      />

      <Button onClick={handleSubmit(onSubmitHandler)} styleType="whiteBg">
        Save
      </Button>
    </>
  );
}

export default EditAGMSpeaker;
