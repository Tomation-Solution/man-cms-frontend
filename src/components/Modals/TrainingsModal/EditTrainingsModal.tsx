import React, { useEffect } from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
  FormSelect,
} from "../../../globals/styles/forms.styles";
import { useForm } from "react-hook-form";
import {
  CustomModalButton,
  SelectImage,
} from "../../../globals/styles/CustomFormComponents";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { trainingsRetrieve, trainingsUpdate } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import { datefromatter } from "../../../utils/DateFormatter";

type InputDataType = {
  image: string;
  name: string;
  is_special: boolean | string;
  group_type: string;
  payment_type: string;
  location: string;
  start_date: Date | string;
  end_date: Date | string;
  is_paid: boolean | string;
  price: number | string;
};

const schema = yup.object({
  name: yup.string().required(),
  is_special: yup.string().required(),
  group_type: yup.string().required(),
  payment_type: yup.string().required(),
  location: yup.string().required(),
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  is_paid: yup.string().required(),
});

const EditTrainingsModal: React.FC<{
  trainingsId: number;
  closefn: () => void;
}> = ({ trainingsId, closefn }) => {
  const queryClient = useQueryClient();

  const { isLoading, isFetching, isError, data } = useQuery(
    `trainings-${trainingsId}`,
    () => trainingsRetrieve(trainingsId),
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      image: "",
      name: "",
      is_special: "",
      group_type: "",
      payment_type: "",
      location: "",
      start_date: "",
      end_date: "",
      is_paid: "",
      price: "",
    },
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        image: data.image,
        name: data.name,
        is_special: data.is_special,
        group_type: data.group_type,
        payment_type: data.payment_type,
        location: data.location,
        start_date: data.start_date,
        end_date: data.end_date,
        is_paid: data.is_paid,
        price: data.price,
      };
      reset(main_data);
    }
  }, [reset, data]);

  const { mutate, isLoading: trainingsLoading } = useMutation(
    (data: any) => trainingsUpdate(data),
    {
      onMutate: () => {
        toast.info("trainings updating...", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
      onSuccess: () => {
        toast.success("trainings updated", {
          icon: false,
          progressClassName: "toastProgress",
        });
        reset();
        queryClient.invalidateQueries("all-trainings");
        closefn();
      },
      onError: () => {
        toast.error("trainings not updated", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const onSubmitHandler = (data: InputDataType) => {
    data.end_date = datefromatter(data.end_date as Date);
    data.start_date = datefromatter(data.start_date as Date);
    if (data.is_paid === "true") {
      let { image, ...payload } = data;
      const FormDataHandler = new FormData();
      if (
        typeof data.image !== "string" &&
        (data.image as any) instanceof FileList
      ) {
        image = image[0];
        FormDataHandler.append("image", image);
      }
      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      mutate({ trainingsId, FormDataHandler });
    } else {
      let { image, price, ...payload } = data;
      const FormDataHandler = new FormData();
      if (
        typeof data.image !== "string" &&
        (data.image as any) instanceof FileList
      ) {
        image = image[0];
        FormDataHandler.append("image", image);
      }
      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      mutate({ trainingsId, FormDataHandler });
    }
  };

  const previousImage = getValues("image");

  return (
    <>
      <ModalsContainer>
        {isLoading || isFetching || trainingsLoading ? (
          <Loading
            light
            loading={isLoading || isFetching || trainingsLoading}
          />
        ) : !isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Edit an Trainings</h2>
            <br />
            <FormError>{errors?.name?.message}</FormError>
            <FormInput>
              <label>
                Name
                <br />
                <input type="text" {...register("name", { required: true })} />
              </label>
            </FormInput>
            <FormInput>
              <SelectImage image={`${previousImage}`} />
              <label>
                Image
                <br />
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", { required: true })}
                />
              </label>
            </FormInput>
            <FormError>{errors?.is_paid?.message}</FormError>
            <FormSelect>
              <label>
                Is Paid Training
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
            <FormError>{errors?.payment_type?.message}</FormError>
            <FormInput>
              <label>
                Payment Type e.g(in-person / online / both)
                <br />
                <input
                  type="text"
                  {...register("payment_type", { required: true })}
                />
              </label>
            </FormInput>
            <FormError>{errors?.group_type?.message}</FormError>
            <FormInput>
              <label>
                Group Type e.g(members / executives / others)
                <br />
                <input
                  type="text"
                  {...register("group_type", { required: true })}
                />
              </label>
            </FormInput>
            <FormError>{errors?.is_special?.message}</FormError>
            <FormSelect>
              <label>
                Is Special Training
                <br />
                <select
                  defaultValue={""}
                  {...register("is_special", { required: true })}
                >
                  <option disabled>select an option</option>
                  <option value={"true"}>Yes</option>
                  <option value={"false"}>No</option>
                </select>
              </label>
            </FormSelect>
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
                Start Date
                <br />
                <input
                  type="date"
                  {...register("end_date", { required: true })}
                />
              </label>
            </FormInput>
            <div>
              <CustomModalButton isDisabled={trainingsLoading}>
                EDIT
              </CustomModalButton>
            </div>
          </Form>
        ) : (
          <FormError>Can't Fetch Trainings</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default EditTrainingsModal;
