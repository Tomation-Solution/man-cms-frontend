import { useForm } from "react-hook-form";
import { getAgmProgramme, updateAgmProgramme } from "../../axios/api-calls";
import { SelectImage } from "../../globals/styles/CustomFormComponents";
import { customFetcher } from "../../utils/customFetcher";
import EmptyState from "../EmptyState/EmptyState";
import InputWithLabel from "../InputWithLabel/InputWithLabel";
import Loading from "../Loading/Loading";
import Button from "../Button/Button";
import { isFileListValidator } from "../../utils/extraFunction";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useEffect } from "react";

type Props = {};

function AGMProgramme({}: Props) {
  const { loadingState, isError, data } = customFetcher<{
    main_text: string;
    main_image: string;
  }>("programme-content", getAgmProgramme);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    main_text: string;
    main_image: any;
  }>();

  useEffect(() => {
    if (data) {
      const main_data = {
        main_text: data?.main_text,
        main_image: data?.main_text,
      };

      reset(main_data);
    }
  }, [reset, data]);

  const { isLoading, mutate } = useMutation(updateAgmProgramme, {
    onSuccess: () => {
      toast.success("update successful");
    },
    onError: () => {
      toast.error("update failed");
    },
  });

  const onSubmitHandler = (inputData: {
    main_text: string;
    main_image: string;
  }) => {
    const { main_image, main_text } = inputData;

    const formData = new FormData();
    formData.append("main_text", main_text);

    if (isFileListValidator(main_image)) {
      formData.append("main_image", main_image[0]);
    }

    mutate(formData);
  };

  if (loadingState) {
    return <EmptyState header="loading programme page data" />;
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
        label="Main Text"
        register={register("main_text", { required: true })}
        errorMessage={errors.main_text ? "invalid main text input" : ""}
      />
      <SelectImage image={data?.main_image} />
      <InputWithLabel
        label="Main Image"
        type="file"
        accept="image/*"
        register={register("main_image", { required: false })}
        errorMessage={errors.main_text ? "invalid main image input" : ""}
      />

      <Button onClick={handleSubmit(onSubmitHandler)}>Update</Button>
    </>
  );
}

export default AGMProgramme;
