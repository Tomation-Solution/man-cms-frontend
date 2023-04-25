import React, { useEffect } from "react";
import { ModalsContainer } from "../Modals/Modals.styles";
import { Form, FormError, FormInput } from "../../globals/styles/forms.styles";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useForm, useFieldArray } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AddMoreButton,
  SelectImage,
} from "../../globals/styles/CustomFormComponents";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import { advocacyRetrieve, advocacyUpdate } from "../../axios/api-calls";
import Loading from "../Loading/Loading";

const schema = yup.object({
  main_achievements: yup
    .array()
    .min(1, "Please add atleast one main achievements paragraph"),
});

const Advocacy = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      main_image: null,
      main_achievements: ["NEW MAIN ACHEIVEMENTS PARAGRAPH"],
    },
  });

  const { fields, append, remove } = useFieldArray({
    //@ts-ignore
    name: "main_achievements",
    control,
    rules: {
      required: "Please add atleast one main achievements paragraph",
    },
  });

  const {
    isLoading: advocacyLoading,
    isFetching,
    isError,
    data,
  } = useQuery("aboutus-advocacy", advocacyRetrieve, {
    refetchOnWindowFocus: false,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        main_image: data.main_image,
        main_achievements: data.main_achievements,
      };
      reset(main_data);
    }
  }, [reset, data]);

  const { mutate, isLoading } = useMutation(
    (data: any) => advocacyUpdate(data),
    {
      onMutate: () => {
        toast.info("advocacy edits saving...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("advocacy edits saved", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("aboutus-advocacy");
      },
      onError: () => {
        toast.error("advocacy not edited", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const onSubmitHandler = (data: any) => {
    console.log(data);

    const FormDataHandler = new FormData();

    let { main_image, ...payload } = data;

    if (
      typeof data.main_image !== "string" &&
      data.main_image instanceof FileList
    ) {
      main_image = main_image[0];
      FormDataHandler.append("main_image", main_image);
    }

    Object.keys(payload)?.forEach((key) =>
      //@ts-ignore
      FormDataHandler.append(key, JSON.stringify(payload[key]))
    );

    mutate(FormDataHandler);
  };

  const previousMainCoreImage = getValues("main_image");

  return (
    <>
      <ModalsContainer>
        <Loading loading={advocacyLoading || isLoading || isFetching} />
        {!isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Edit Advocacy Data</h2>
            <br />
            <FormInput>
              <SelectImage image={`${previousMainCoreImage}`} />
              <label>
                Main Image
                <br />
                <input
                  type="file"
                  accept="image/*"
                  {...register("main_image", { required: false })}
                />
              </label>
            </FormInput>

            {fields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Advocacy Achievements Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`main_achievements.${index}`, {
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
            <FormError>{errors?.main_achievements?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => append("NEW_PARAGRAPH")}
            >
              Add More Advocacy Achievements Paragraphs
            </AddMoreButton>

            <br />
            <Button styleType="pry">EDIT</Button>
          </Form>
        ) : (
          <FormError>Can't Fetch Advocacy Data</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default Advocacy;
