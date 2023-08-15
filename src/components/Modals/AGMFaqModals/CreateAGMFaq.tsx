import { useForm } from "react-hook-form";
import { AGMFaqType } from "../../AGMSection/types";
import InputWithLabel from "../../InputWithLabel/InputWithLabel";
import TextRichEditor from "../../../globals/TextRichEditor/TextRichEditor";
import Button from "../../Button/Button";
import { useMutation, useQueryClient } from "react-query";
import { createAgmFaq } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";

type Props = {
  closefn: () => void;
};

function CreateAGMFaq({ closefn }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<AGMFaqType>({
    defaultValues: {
      content: "<p>Content Details</p>",
    },
  });

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation(createAgmFaq, {
    onSuccess: () => {
      toast.success("creation successful");
      queryClient.invalidateQueries("all-agm-faqs");
      reset();
      closefn();
    },
    onError: () => {
      toast.error("creation failed");
    },
  });

  const onSubmitHandler = (inputData: AGMFaqType) => {
    mutate(inputData);
  };

  return (
    <>
      <Loading loading={isLoading} />

      <InputWithLabel
        label="Header"
        register={register("header", { required: true })}
        errorMessage={errors.header ? "header is required" : ""}
      />

      <TextRichEditor
        header="Content"
        editorState={watch("content")}
        setEditorState={(e) => setValue("content", e)}
      />

      <Button styleType="whiteBg" onClick={handleSubmit(onSubmitHandler)}>
        Save
      </Button>
    </>
  );
}

export default CreateAGMFaq;
