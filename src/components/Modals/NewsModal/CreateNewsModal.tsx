import React, { useState } from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormHalveInput,
  FormInput,
  FormRadio,
  Header,
} from "../../../globals/styles/forms.styles";
import { useForm, useFieldArray } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AddMoreButton,
  CustomModalButton,
} from "../../../globals/styles/CustomFormComponents";
import { useMutation, useQueryClient } from "react-query";
import { newsCreate, rel8News } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import Button from "../../Button/Button";
import { validateFileExtension } from "../../../utils/extensionValidator";
import useRel8AuthStore from "../../../zustand/rel8-store";
import Rel8LoginModal from "../Rel8LoginModal";

type detailsObj = {
  header: string;
  value: string;
};

type formInputData = {
  name: string;
  title: string;
  link: string;
  to_rel8: string;
  image: any;
  details: detailsObj[];
};

const schema = yup.object({
  name: yup.string().required(),
  title: yup.string().required(),
  link: yup.mixed().test({
    message: "Please provide a supported file type",
    test: (file, context) => {
      if (!file) {
        return false;
      }
      const isValid = validateFileExtension(file, false);
      if (!isValid) {
        return isValid;
      }
      return isValid;
    },
  }),
  image: yup.mixed().required(),
  to_rel8: yup.string().required("please select an option"),
  details: yup
    .array(
      yup.object({
        header: yup.string().required(),
        value: yup.string().required(),
      })
    )
    .min(1, "Please add atleast one header value pair"),
});

const CreateNewsModal: React.FC<{ closefn: () => void }> = ({ closefn }) => {
  const queryClient = useQueryClient();
  const [loginModal, setLoginModal] = useState(false);
  const rel8UserData = useRel8AuthStore.getState().user;

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      title: "",
      to_rel8: "",
      link: "",
      image: null,
      details: [
        {
          header: "please fill header field",
          value: "please fill value field",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "details",
    control,
    rules: {
      required: "Please add atleast one header value pair",
    },
  });

  const { mutate, isLoading } = useMutation((data: any) => newsCreate(data), {
    onMutate: () => {
      toast.info("news creating", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("news created", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-news");
      closefn();
    },
    onError: () => {
      toast.error("news not created", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const rel8NewsMutResult = useMutation(rel8News, {
    onMutate: () => {
      toast.info("posting news to Rel8");
    },
    onError: () => {
      toast.error("failed to post news to Rel8");
    },
    onSuccess: () => {
      toast.success("news posted on Rel8");
    },
  });

  const onSubmitHandler = (dataInput: formInputData) => {
    let { to_rel8, ...data } = dataInput;
    if (to_rel8 === "yes") {
      if (!rel8UserData?.token) {
        setLoginModal(true);
        return null;
      } else {
        const rel8FormData = new FormData();
        rel8FormData.append("name", data.name);
        rel8FormData.append("is_exco", "false");
        rel8FormData.append("is_committe", "false");
        rel8FormData.append("is_member", "false");
        rel8FormData.append("body", data.title);
        rel8FormData.append("image", data.image[0]);
        const rel8newsparagraph = data.details.map((item) => ({
          heading: item.header,
          paragragh: item.value,
        }));
        rel8FormData.append(
          "news_paragraph",
          JSON.stringify(rel8newsparagraph)
        );

        rel8NewsMutResult.mutateAsync(rel8FormData);
      }
    }

    let { image, details, link, ...payload } = data;
    image = image[0];
    link = link[0];
    const FormDataHandler = new FormData();
    FormDataHandler.append("image", image);
    FormDataHandler.append("link", link);
    FormDataHandler.append("details", JSON.stringify(details));
    Object.keys(payload)?.forEach((key) =>
      //@ts-ignore
      FormDataHandler.append(key, payload[key])
    );
    mutate(FormDataHandler);
  };

  return (
    <>
      {loginModal && <Rel8LoginModal closefn={() => setLoginModal(false)} />}
      {!loginModal && (
        <ModalsContainer>
          {isLoading || rel8NewsMutResult.isLoading ? (
            <Loading light loading={isLoading || rel8NewsMutResult.isLoading} />
          ) : (
            <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <h2>Create a News</h2>
              <br />
              <FormError>{errors?.name?.message}</FormError>
              <FormInput>
                <label>
                  Name
                  <br />
                  <input
                    type="text"
                    {...register("name", { required: true })}
                  />
                </label>
              </FormInput>
              <FormError>{errors?.image?.message}</FormError>
              <FormInput>
                <label>
                  Image
                  <br />
                  <input
                    type="file"
                    accept="image/*"
                    required
                    {...register("image", { required: true })}
                  />
                </label>
              </FormInput>
              <FormError>{errors?.title?.message}</FormError>
              <FormInput>
                <label>
                  Title
                  <br />
                  <input
                    type="text"
                    {...register("title", { required: true })}
                  />
                </label>
              </FormInput>
              <FormError>{errors?.link?.message}</FormError>
              <FormInput>
                <label>
                  Upload File*
                  <br />
                  <input
                    type={"file"}
                    accept=".doc,.docx,.odt,.pdf,.xls,.xlsx,.ppt,.pptx,.txt,.ods"
                    style={{ backgroundColor: "#fff" }}
                    {...register("link", { required: true })}
                  />
                </label>
              </FormInput>

              {fields.map((fields, index) => (
                <section key={fields.id}>
                  <FormInput>
                    <label>
                      Header*
                      <br />
                      <input
                        type={"text"}
                        style={{ backgroundColor: "#fff" }}
                        {...register(`details.${index}.header`, {
                          required: true,
                        })}
                      />
                    </label>
                  </FormInput>

                  <FormInput>
                    <label>
                      Description*
                      <br />
                      <textarea
                        style={{ backgroundColor: "#fff" }}
                        rows={6}
                        cols={50}
                        {...register(`details.${index}.value`, {
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
              <FormError>{errors?.details?.message}</FormError>
              <AddMoreButton
                justify="flex-start"
                click={() =>
                  append({
                    header: "please fill header field",
                    value: "please fill vlaue field",
                  })
                }
              >
                Add More
              </AddMoreButton>

              <section>
                <Header>
                  <h3>Also create this news on rel8?</h3>
                </Header>
                <FormError>{errors.to_rel8?.message}</FormError>
                <FormHalveInput>
                  <FormRadio>
                    <label>
                      Yes
                      <input
                        type="radio"
                        {...register("to_rel8")}
                        value={"yes"}
                      />
                    </label>
                  </FormRadio>

                  <FormRadio>
                    <label>
                      No
                      <input
                        type="radio"
                        {...register("to_rel8")}
                        value={"no"}
                      />
                    </label>
                  </FormRadio>
                </FormHalveInput>
              </section>

              <div>
                <CustomModalButton isDisabled={isLoading}>
                  CREATE
                </CustomModalButton>
              </div>
            </Form>
          )}
        </ModalsContainer>
      )}
    </>
  );
};

export default CreateNewsModal;
