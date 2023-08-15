import { yupResolver } from "@hookform/resolvers/yup";
import { retrieveAgmProgram, updateAgmProgram } from "../../../axios/api-calls";
import { customFetcher } from "../../../utils/customFetcher";
import {
  AGMProgramValidator,
  AGMProgramValidatorType,
} from "../../AGMSection/validation";
import EmptyState from "../../EmptyState/EmptyState";
import { useForm } from "react-hook-form";
import Loading from "../../Loading/Loading";
import InputWithLabel from "../../InputWithLabel/InputWithLabel";
import { useEffect } from "react";
import { AGMProgrmType } from "../../AGMSection/types";
import Button from "../../Button/Button";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { isFileListValidator } from "../../../utils/extraFunction";

type Props = {
  itemId: any;
  closefn: () => void;
};

function EditAGMProgram({ itemId, closefn }: Props) {
  const { loadingState, isError, data } = customFetcher<AGMProgrmType>(
    `"program-${itemId}"`,
    () => retrieveAgmProgram(itemId),
    (data) => data
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AGMProgramValidatorType>({
    resolver: yupResolver(AGMProgramValidator),
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        program_date: data?.program_date,
        program_title: data?.program_title,
        program_attached_file_link: data?.program_attached_file_link,
        program_attached_file1: data?.program_attached_file1,
        program_attached_file2: data?.program_attached_file2,
      };

      reset(main_data);
    }
  }, [reset, data]);

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation(updateAgmProgram, {
    onSuccess: () => {
      queryClient.invalidateQueries("all-programs");
      closefn();
      toast.success("updated successfully");
    },
    onError: () => {
      toast.error("failed to update");
    },
  });

  const onSubmitHandler = (inputData: AGMProgramValidatorType) => {
    const { program_attached_file1, program_attached_file2, ...payload } =
      inputData;

    const formData = new FormData();

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

    mutate({
      id: itemId,
      formData: formData,
    });
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
        label="Program Title"
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

export default EditAGMProgram;
