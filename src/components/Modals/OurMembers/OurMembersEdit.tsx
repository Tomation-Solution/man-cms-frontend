import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ourMembersRetrieve, ourMembersUpdate } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import Loading from "../../Loading/Loading";

const schema = yup.object({
  name: yup.string().required(),
  website: yup.string().url().notRequired(),
  description: yup.string().url().notRequired(),
});

interface InputData extends yup.InferType<typeof schema> {}

const OurMembersEdit: React.FC<{ closefn: () => void; memId: number }> = ({
  closefn,
  memId,
}) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      website: "",
      description: "",
    },
  });

  const {
    isLoading: getLoading,
    isError,
    isFetching,
    data,
  } = useQuery(`membership-member-${memId}`, () => ourMembersRetrieve(memId), {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        name: data.name,
        website: data.website,
        description: "",
      };

      reset(main_data);
    }
  }, [reset, data]);

  const { isLoading, mutate } = useMutation(ourMembersUpdate, {
    onMutate: () => {
      toast.info("Member updating", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("Member updated", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries(`membership-member-${memId}`);
      queryClient.invalidateQueries("all-members");
      closefn();
    },
    onError: () => {
      toast.error("Member not updated", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: InputData) => {
    mutate({ id: memId, data });
  };

  return (
    <>
      <ModalsContainer>
        {getLoading || isLoading || isFetching ? (
          <Loading light loading={getLoading || isLoading || isFetching} />
        ) : !isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Edit Member</h2>
            <br />
            <FormError>{errors?.name?.message}</FormError>
            <FormInput>
              <label>
                Name *
                <br />
                <input type="text" {...register("name")} />
              </label>
            </FormInput>
            <FormError>{errors?.website?.message}</FormError>
            <FormInput>
              <label>
                Website
                <br />
                <input type="text" {...register("website")} />
              </label>
            </FormInput>
            <FormError>{errors?.description?.message}</FormError>
            <FormInput>
              <label>
                Description
                <br />
                <input type="text" {...register("description")} />
              </label>
            </FormInput>

            <div>
              <CustomModalButton isDisabled={isLoading}>SAVE</CustomModalButton>
            </div>
          </Form>
        ) : (
          <FormError>Can't Fetch Member Data</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default OurMembersEdit;
