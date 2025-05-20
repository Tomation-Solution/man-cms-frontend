import React from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
  FormSelect,
} from "../../../globals/styles/forms.styles";
import { useForm } from "react-hook-form";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "react-query";
import { trainingsCreate } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import { datefromatter } from "../../../utils/DateFormatter";

type InputDataType = {
  image: string;
  name: string;
  training_type: boolean | string;
  group_type: string;
  location: string;
  start_date: Date | string;
  end_date: Date | string;
  is_paid: boolean | string;
  price: number | string;
};

const schema = yup.object({
  image: yup.mixed().required(),
  name: yup.string().required(),
  training_type: yup.string().required(),
  group_type: yup.string().required(),
  location: yup.string().required(),
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  is_paid: yup.string().required(),
});

const CreateTrainings: React.FC<{ closefn: () => void }> = ({ closefn }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      image: "",
      name: "",
      training_type: "",
      group_type: "",
      location: "",
      start_date: "",
      end_date: "",
      is_paid: "",
      price: "",
    },
  });

  const { mutate, isLoading } = useMutation(
    (data: any) => trainingsCreate(data),
    {
      onMutate: () => {
        toast.info("trainings creating...", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
      onSuccess: () => {
        toast.success("trainings created", {
          icon: false,
          progressClassName: "toastProgress",
        });
        reset();
        queryClient.invalidateQueries("all-trainings");
        closefn();
      },
      onError: () => {
        toast.error("trainings not created", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const onSubmitHandler = (data: InputDataType) => {
    if (data.is_paid == "true") {
      data.end_date = datefromatter(data.end_date as Date);
      data.start_date = datefromatter(data.start_date as Date);
      let { image, ...payload } = data;
      image = image[0];
      const FormDataHandler = new FormData();
      FormDataHandler.append("image", image);
      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      mutate(FormDataHandler);
    } else {
      data.end_date = datefromatter(data.end_date as Date);
      data.start_date = datefromatter(data.start_date as Date);
      let { image, price, ...payload } = data;
      image = image[0];
      const FormDataHandler = new FormData();
      FormDataHandler.append("image", image);
      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      mutate(FormDataHandler);
    }
  };

  return (
    <>
      <ModalsContainer>
        {isLoading ? (
          <Loading light loading={isLoading} />
        ) : (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Create an Trainings</h2>
            <br />
            <FormError>{errors?.name?.message}</FormError>
            <FormInput>
              <label>
                Name
                <br />
                <input type="text" {...register("name", { required: true })} />
              </label>
            </FormInput>
            <FormError>{errors?.image?.message}</FormError>
            <FormInput>
              <label>
                Image
                <br />
                <small>Aspect Ratio: 16/7</small>
                <input
                  type="file"
                  accept="image/*"
                  required
                  {...register("image", { required: true })}
                />
              </label>
            </FormInput>
            <FormError>{errors?.is_paid?.message}</FormError>
            <FormSelect>
              <label>
                Is this a paid training
                <br />
                <small>If true a valid price must be provided</small>
                <br />
                <select
                  defaultValue={""}
                  {...register("is_paid", { required: true })}
                >
                  <option disabled>select an option</option>
                  <option value={"true"}>Yes</option>
                  <option value={"false"}>No</option>
                </select>
              </label>
            </FormSelect>
            <FormInput>
              <label>
                Price
                <br />
                <input
                  type="number"
                  min={0}
                  {...register("price", { required: false })}
                />
              </label>
            </FormInput>
            <FormError>{errors?.location?.message}</FormError>
            <FormInput>
              <label>
                Location
                <br />
                <textarea {...register("location", { required: true })} />
              </label>
            </FormInput>
            <FormError>{errors?.group_type?.message}</FormError>
            <FormInput>
              <label>
                Target Audience e.g(members / executives / others)
                <br />
                <input
                  type="text"
                  {...register("group_type", { required: true })}
                />
              </label>
            </FormInput>
            <FormError>{errors?.training_type?.message}</FormError>
            <FormInput>
              <label>
                Type of Training e.g (MRC, MPDCL, OTHER)
                <br />
                <input
                  type="text"
                  {...register("training_type", { required: true })}
                />
              </label>
            </FormInput>
            <FormError>
              {errors?.start_date?.message ? "invalid start date" : null}
            </FormError>
            <FormInput>
              <label>
                Start Date
                <br />
                <input
                  type="date"
                  {...register("start_date", { required: true })}
                />
              </label>
            </FormInput>
            <FormError>
              {errors?.end_date?.message ? "invalid end date" : null}
            </FormError>
            <FormInput>
              <label>
                End Date
                <br />
                <input
                  type="date"
                  {...register("end_date", { required: true })}
                />
              </label>
            </FormInput>
            <div>
              <CustomModalButton isDisabled={false}>CREATE</CustomModalButton>
            </div>
          </Form>
        )}
      </ModalsContainer>
    </>
  );
};

export default CreateTrainings;
