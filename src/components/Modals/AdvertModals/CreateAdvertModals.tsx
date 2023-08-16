import { useForm } from "react-hook-form";

import InputWithLabel from "../../InputWithLabel/InputWithLabel";
import { AdvertType } from "../../AdvertSection/types";
import Button from "../../Button/Button";
import Loading from "../../Loading/Loading";
import { useMutation, useQueryClient } from "react-query";
import { createAdvert } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import { isFileListValidator } from "../../../utils/extraFunction";

type Props = {
  closefn: () => void;
};

function CreateAdvertModals({ closefn }: Props) {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<AdvertType>();

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation(createAdvert, {
    onSuccess: () => {
      toast.success("advert created");
      queryClient.invalidateQueries("all-adverts");
      reset();
      closefn();
    },
    onError: () => {
      toast.error("failed to create");
    },
  });

  const onSubmitHandler = (inputData: AdvertType) => {
    const { image, text } = inputData;

    const formData = new FormData();

    if (isFileListValidator(image)) {
      formData.append("image", image[0]);
    }

    formData.append("text", text);

    mutate(formData);
  };

  return (
    <>
      <Loading loading={isLoading} />
      <InputWithLabel
        label="Text"
        register={register("text", { required: true })}
        errorMessage={errors?.text ? "invalid text" : ""}
      />

      <InputWithLabel
        label="Image"
        type="file"
        accept="image/*"
        register={register("image", { required: true })}
        errorMessage={errors?.image ? "invalid image" : ""}
      />

      <Button styleType="whiteBg" onClick={handleSubmit(onSubmitHandler)}>
        Save
      </Button>
    </>
  );
}

export default CreateAdvertModals;
