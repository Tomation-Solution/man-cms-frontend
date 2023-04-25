import React, { useEffect } from "react";
import { ModalsContainer } from "../Modals/Modals.styles";
import { Form, FormError, FormInput } from "../../globals/styles/forms.styles";
import Button from "../Button/Button";
import {
  AddMoreButton,
  SelectImage,
} from "../../globals/styles/CustomFormComponents";
import { useForm, useFieldArray } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loading from "../Loading/Loading";
import { toast } from "react-toastify";
import { affilliatesRetrieve, affilliatesUpdate } from "../../axios/api-calls";

const schema = yup.object({
  international_partners: yup
    .array()
    .min(1, "Please add atleast one international partners paragraph"),
  ops: yup.array().min(1, "Please add atleast one ops paragraph"),
});

const Affilliates = () => {
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
      ops: ["NEW OPS PARAGRAPH"],
      international_partners: ["NEW INTERNATIONAL PARTNERS PARAGRAPH"],
    },
  });

  const {
    isLoading: dataLoading,
    isFetching,
    isError,
    data,
  } = useQuery("aboutus-advocacy", affilliatesRetrieve, {
    refetchOnWindowFocus: false,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        main_image: data.main_image,
        ops: data.ops,
        international_partners: data.international_partners,
      };
      reset(main_data);
    }
  }, [reset, data]);

  const { fields, append, remove } = useFieldArray({
    //@ts-ignore
    name: "international_partners",
    control,
    rules: {
      required: "Please add atleast one international achievements paragraph",
    },
  });

  const {
    fields: opsfields,
    append: opsappend,
    remove: opsremove,
  } = useFieldArray({
    //@ts-ignore
    name: "ops",
    control,
    rules: {
      required: "Please add atleast one ops paragraph",
    },
  });

  const { mutate, isLoading } = useMutation(
    (data: any) => affilliatesUpdate(data),
    {
      onMutate: () => {
        toast.info("affilliates edits saving...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("affilliates edits saved", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("aboutus-affilliates");
      },
      onError: () => {
        toast.error("affilliates not edited", {
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
        <Loading loading={dataLoading || isLoading || isFetching} />
        {!isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Edit Affilliates Data</h2>
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
                    Advocacy International Partners Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`international_partners.${index}`, {
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
            <FormError>{errors?.international_partners?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => append("NEW_PARAGRAPH")}
            >
              Add More International Partners Paragraphs
            </AddMoreButton>

            {opsfields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Advocacy OPS Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`ops.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => opsremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.ops?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => opsappend("NEW_PARAGRAPH")}
            >
              Add More OPS Paragraphs
            </AddMoreButton>

            <br />
            <Button styleType="pry">EDIT</Button>
          </Form>
        ) : (
          <FormError>Can't Fetch Affilliates Data</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default Affilliates;
