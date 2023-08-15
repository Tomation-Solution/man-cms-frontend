import { useForm } from "react-hook-form";
import {
  AGMSpeakerValidator,
  AGMSpeakerValidatorType,
} from "../../AGMSection/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../Button/Button";
import InputWithLabel from "../../InputWithLabel/InputWithLabel";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { createAgmSpeaker } from "../../../axios/api-calls";
import Loading from "../../Loading/Loading";
import { isFileListValidator } from "../../../utils/extraFunction";
import TextRichEditor from "../../../globals/TextRichEditor/TextRichEditor";

type Props = {
  closefn: () => void;
};

function CreateAGMSpeaker({ closefn }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AGMSpeakerValidatorType>({
    resolver: yupResolver(AGMSpeakerValidator),
    defaultValues: { speaker_words: "<p>Speaker Details</p>" },
  });

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation(createAgmSpeaker, {
    onSuccess: () => {
      toast.success("created successfully");
      queryClient.invalidateQueries("all-speaker");
      reset();
      closefn();
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

    mutate(formData);
  };

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

export default CreateAGMSpeaker;
