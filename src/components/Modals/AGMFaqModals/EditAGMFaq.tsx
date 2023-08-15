import { useForm } from "react-hook-form";
import InputWithLabel from "../../InputWithLabel/InputWithLabel";
import Loading from "../../Loading/Loading";
import { AGMFaqType } from "../../AGMSection/types";
import { useMutation, useQueryClient } from "react-query";
import { customFetcher } from "../../../utils/customFetcher";
import { editAgmFaq, retrieveAgmFaq } from "../../../axios/api-calls";
import { useEffect } from "react";
import { toast } from "react-toastify";
import TextRichEditor from "../../../globals/TextRichEditor/TextRichEditor";
import Button from "../../Button/Button";
import EmptyState from "../../EmptyState/EmptyState";

type Props = {
  itemId: any;
  closefn: () => void;
};

function EditAGMFaq({ itemId, closefn }: Props) {
  const { loadingState, isError, data } = customFetcher<AGMFaqType>(
    `agm-faq-${itemId}`,
    () => retrieveAgmFaq(itemId),
    (data) => data
  );

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

  useEffect(() => {
    if (data) {
      const main_data = {
        header: data?.header,
        content: data?.content,
      };

      reset(main_data);
    }
  }, [data, reset]);

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation(editAgmFaq, {
    onSuccess: () => {
      toast.success("creation successful");
      queryClient.invalidateQueries("all-agm-faqs");
      closefn();
    },
    onError: () => {
      toast.error("creation failed");
    },
  });

  const onSubmitHandler = (inputData: AGMFaqType) => {
    mutate({ id: itemId, formData: inputData });
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

export default EditAGMFaq;
