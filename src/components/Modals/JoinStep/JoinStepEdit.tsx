import React, { useEffect } from "react";
import {
  AddMoreButton,
  CustomModalButton,
} from "../../../globals/styles/CustomFormComponents";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import Button from "../../Button/Button";
import { ModalsContainer } from "../Modals.styles";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { joinStepRetrieve, joinStepUpdate } from "../../../axios/api-calls";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "../../Loading/Loading";

const schema = yup.object({
  step_name: yup.string().required(),
  step_list: yup
    .array()
    .min(0, "Please add atleast one step paragraph")
    .notRequired(),
  step_description: yup.string().required(),
  step_extras: yup
    .array()
    .min(0, "Please add atleast one step extra")
    .notRequired(),
});

interface InputData extends yup.InferType<typeof schema> {}

const JoinStepEdit: React.FC<{ joinId: number; closefn: () => void }> = ({
  closefn,
  joinId,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      step_name: "",
      step_list: ["NEW STEP LIST PARAGRAPH"],
      step_description: "",
      step_extras: ["NEW STEP EXTRA PARAGRAPH"],
    },
  });

  const { fields, remove, append } = useFieldArray({
    control,
    //@ts-ignore
    name: "step_list",
  });
  const {
    fields: extrafields,
    remove: extraremove,
    append: extraappend,
  } = useFieldArray({
    control,
    //@ts-ignore
    name: "step_extras",
  });

  const {
    isLoading: getLoading,
    isFetching,
    isError,
    data,
  } = useQuery(
    `memership-join-step-${joinId}`,
    () => joinStepRetrieve(joinId),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      const main_data = {
        step_name: data.step_name,
        step_list: data.step_list,
        step_description: data.step_description,
        step_extras: data.step_extras,
      };

      reset(main_data);
    }
  }, [reset, data]);

  const { isLoading, mutate } = useMutation(joinStepUpdate, {
    onMutate: () => {
      toast.info("join step detail updating", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("join step detail updated", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries(`memership-join-step-${joinId}`);
      queryClient.invalidateQueries("all-join-step");
      closefn();
    },
    onError: () => {
      toast.error("join step detail not updated", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: InputData) => {
    mutate({ id: joinId, data });
  };

  return (
    <>
      <ModalsContainer>
        {getLoading || isFetching || isLoading ? (
          <Loading light loading={getLoading || isFetching || isLoading} />
        ) : !isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Edit Why Join Item</h2>
            <FormError>{errors?.step_name?.message}</FormError>
            <FormInput>
              <label>
                Step Name *
                <br />
                <input type="text" {...register("step_name")} />
              </label>
            </FormInput>

            <FormError>{errors?.step_description?.message}</FormError>
            <FormInput>
              <label>
                Step Description*
                <br />
                <input type="text" {...register("step_description")} />
              </label>
            </FormInput>

            {fields.map((field, index) => (
              <section key={field.id}>
                <FormInput>
                  <label>
                    Step List Paragraph
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`step_list.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button styleType={"whiteBg"} onClick={() => remove(index)}>
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.step_list?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => append("NEW STEP LIST PARAGRAPH")}
            >
              Add More Step List Paragraphs
            </AddMoreButton>

            {extrafields.map((field, index) => (
              <section key={field.id}>
                <FormInput>
                  <label>
                    Step Extra Paragraph
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`step_extras.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => extraremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.step_extras?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => extraappend("NEW STEP EXTRA PARAGRAPH")}
            >
              Add More Step Extra Paragraphs
            </AddMoreButton>

            <div>
              <CustomModalButton isDisabled={isLoading}>Edit</CustomModalButton>
            </div>
          </Form>
        ) : (
          <FormError>Can't Fetch Join Step</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default JoinStepEdit;
