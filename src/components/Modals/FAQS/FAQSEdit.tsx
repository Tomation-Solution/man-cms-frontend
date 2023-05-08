import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { faqRetrieve, faqUpdate } from "../../../axios/api-calls";
import { toast } from "react-toastify";
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
import Loading from "../../Loading/Loading";

const schema = yup.object({
  header: yup.string().required(),
  content: yup
    .array()
    .min(1, "Please add atleast one step paragraph")
    .required(),
});

interface InputData extends yup.InferType<typeof schema> {}

const FAQSEdit: React.FC<{ closefn: () => void; faqId: number }> = ({
  faqId,
  closefn,
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
      header: "",
      content: ["NEW FAQ CONTENT LINE"],
    },
  });

  const { fields, remove, append } = useFieldArray({
    control,
    //@ts-ignore
    name: "content",
  });

  const {
    isLoading: getLoading,
    isFetching,
    isError,
    data,
  } = useQuery(`membership-faqs-${faqId}`, () => faqRetrieve(faqId), {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        header: data.header,
        content: data.content,
      };
      reset(main_data);
    }
  }, [reset, data]);

  const { isLoading, mutate } = useMutation(faqUpdate, {
    onMutate: () => {
      toast.info("FAQ creating", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("FAQ created", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries(`membership-faqs-${faqId}`);
      queryClient.invalidateQueries("all-faqs");
      closefn();
    },
    onError: () => {
      toast.error("FAQ not created", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: InputData) => {
    mutate({ id: faqId, data });
  };

  return (
    <>
      <ModalsContainer>
        {getLoading || isFetching || isLoading ? (
          <Loading light loading={getLoading || isLoading || isFetching} />
        ) : !isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Edit FAQ Item</h2>
            <FormError>{errors?.header?.message}</FormError>
            <FormInput>
              <label>
                Header *
                <br />
                <input type="text" {...register("header")} />
              </label>
            </FormInput>

            {fields.map((field, index) => (
              <section key={field.id}>
                <FormInput>
                  <label>
                    Content
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff", height: "100px" }}
                      {...register(`content.${index}`, {
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
            <FormError>{errors?.content?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => append("NEW FAQ CONTENT LINE")}
            >
              Add More FAQ content lines
            </AddMoreButton>

            <div>
              <CustomModalButton isDisabled={isLoading}>SAVE</CustomModalButton>
            </div>
          </Form>
        ) : (
          <FormError>Can't Fetch FAQs Data</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default FAQSEdit;
