import Button from "../../Button/Button";
import { useForm } from "react-hook-form";
import InputWithLabel from "../../InputWithLabel/InputWithLabel";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AGMProgramValidator,
  AGMProgramValidatorType,
} from "../../AGMSection/validation";
import { useMutation, useQueryClient } from "react-query";
import { createAgmProgram } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import { isFileListValidator } from "../../../utils/extraFunction";

type Props = {
  closefn: () => void;
  id?: string;
};

function CreateAGMProgram({ closefn, id }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AGMProgramValidatorType>({
    resolver: yupResolver(AGMProgramValidator),
  });

  const queryClient = useQueryClient();

  const { isLoading, mutate, error } = useMutation(
    (data: any) => createAgmProgram({ id }, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("all-programs");
        reset();
        toast.success("created successfully");
        closefn();
      },
      onError: () => {
        toast.error("failed to create");
      },
    }
  );

  const onSubmitHandler = (inputData: AGMProgramValidatorType) => {
    const { program_attached_file1, program_attached_file2, ...payload } =
      inputData;

    const formData = new FormData();
    formData.append("event_id", id || "");

    if (isFileListValidator(program_attached_file1)) {
      //@ts-ignore
      formData.append("program_attached_file1", program_attached_file1[0]);
    }

    if (isFileListValidator(program_attached_file2)) {
      //@ts-ignore
      formData.append("program_attached_file2", program_attached_file2[0]);
    }

    //@ts-ignore
    Object.keys(payload).forEach((key) => formData.append(key, payload[key]));

    mutate(formData);
  };

  return (
    <>
      <Loading loading={isLoading} />
      <InputWithLabel
        label="Program Title"
        small_text="Must be diffrent from other existing programs in this event"
        register={register("program_title")}
        errorMessage={errors.program_title?.message}
      />

      <InputWithLabel
        label="Program Date"
        type="date"
        register={register("program_date")}
        errorMessage={errors.program_date?.message}
      />

      <InputWithLabel
        label="Program Attached File (url only/optional)"
        register={register("program_attached_file_link")}
        errorMessage={errors.program_attached_file_link?.message}
      />

      <InputWithLabel
        label="Program Attached Video .max six of 9mb (optional)"
        type="file"
        accept="video/*"
        register={register("program_attached_file1")}
        errorMessage={errors.program_attached_file1?.message}
      />

      <InputWithLabel
        label="Program Attached File .max six of 9mb (optional)"
        type="file"
        accept="video/*"
        register={register("program_attached_file2")}
        errorMessage={errors.program_attached_file2?.message}
      />

      <Button styleType="whiteBg" onClick={handleSubmit(onSubmitHandler)}>
        Save
      </Button>
    </>
  );
}

export default CreateAGMProgram;
