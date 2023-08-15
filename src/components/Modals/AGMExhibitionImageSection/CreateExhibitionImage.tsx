import { yupResolver } from "@hookform/resolvers/yup";
import {
  AGMExhibitionValidator,
  AGMExhibitionValidatorType,
} from "../../AGMSection/validation";
import Button from "../../Button/Button";
import InputWithLabel from "../../InputWithLabel/InputWithLabel";
import { useForm } from "react-hook-form";
import { isFileListValidator } from "../../../utils/extraFunction";
import { useMutation, useQueryClient } from "react-query";
import { createAgmExhibitionImage } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import { FormError, FormSelect } from "../../../globals/styles/forms.styles";

type Props = {
  closefn: () => void;
};

function CreateExhibitionImage({ closefn }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AGMExhibitionValidatorType>({
    resolver: yupResolver(AGMExhibitionValidator),
  });

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation(createAgmExhibitionImage, {
    onSuccess: () => {
      queryClient.invalidateQueries("all-previous-exhibition");
      toast.success("creation successful");
      reset();
      closefn();
    },
    onError: () => {
      toast.error("failed to create");
    },
  });

  const onSubmitHandler = (inputData: AGMExhibitionValidatorType) => {
    const { image, type } = inputData;

    const formData = new FormData();

    if (isFileListValidator(image)) {
      //@ts-ignore
      formData.append("image", image[0]);
    }

    formData.append("type", type);

    mutate(formData);
  };

  return (
    <>
      <Loading loading={isLoading} />
      <InputWithLabel
        label="Image"
        type="file"
        accept=".jpeg,.jpg,.png,.gif"
        register={register("image")}
        errorMessage={errors.image?.message}
      />

      <FormSelect>
        <label htmlFor="">Image Type</label>
        <select {...register("type")}>
          <option value="exhibition">Exhibition</option>
          <option value="company">Company</option>
        </select>
        <FormError>{errors?.type?.message}</FormError>
      </FormSelect>

      <Button styleType="whiteBg" onClick={handleSubmit(onSubmitHandler)}>
        Save
      </Button>
    </>
  );
}

export default CreateExhibitionImage;
