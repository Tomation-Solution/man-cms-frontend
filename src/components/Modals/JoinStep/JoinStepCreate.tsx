import React from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { useForm, useFieldArray } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "react-query";
import { joinStepCreate } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import {
  AddMoreButton,
  CustomModalButton,
} from "../../../globals/styles/CustomFormComponents";
import Button from "../../Button/Button";

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

const JoinStepCreate: React.FC<{ closefn: () => void }> = ({ closefn }) => {
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

  const { isLoading, mutate } = useMutation(joinStepCreate, {
    onMutate: () => {
      toast.info("join step detail creating", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("join step detail created", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-join-step");
      closefn();
    },
    onError: () => {
      toast.error("join step detail not created", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: InputData) => {
    mutate(data);
  };

  return (
    <>
      <ModalsContainer>
        <Form onSubmit={handleSubmit(onSubmitHandler)}>
          <h2>Create Why Join Item</h2>
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
            <CustomModalButton isDisabled={isLoading}>CREATE</CustomModalButton>
          </div>
        </Form>
      </ModalsContainer>
    </>
  );
};

export default JoinStepCreate;
