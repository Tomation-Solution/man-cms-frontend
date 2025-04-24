import React, { useState } from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormHalveInput,
  FormInput,
  FormRadio,
  FormSelect,
  Header,
} from "../../../globals/styles/forms.styles";
import { useForm } from "react-hook-form";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "react-query";
import { eventsCreate, rel8Event } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import { datefromatter } from "../../../utils/DateFormatter";
import useRel8AuthStore from "../../../zustand/rel8-store";
import Rel8LoginModal from "../Rel8LoginModal";

type InputDataType = {
  image: string;
  name: string;
  is_agm: boolean | string;
  is_current_agm: boolean | string;
  group_type: string;
  location: string;
  to_rel8: string;
  start_date: Date | string;
  end_date: Date | string;
  is_paid: string;
  price: number | string;
};

const schema = yup.object({
  image: yup.mixed().required(),
  name: yup.string().required(),
  is_agm: yup.string().required(),
  is_current_agm: yup.string(),
  group_type: yup.string().required(),
  location: yup.string().required(),
  to_rel8: yup.string().required("please select an option"),
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  is_paid: yup.string().required(),
});

const CreateEventModal: React.FC<{ closefn: () => void }> = ({ closefn }) => {
  const queryClient = useQueryClient();
  const [loginModal, setLoginModal] = useState(false);
  const rel8UserData = useRel8AuthStore.getState().user;

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
      is_agm: "",
      is_current_agm: "",
      group_type: "",
      location: "",
      start_date: "",
      to_rel8: "",
      end_date: "",
      is_paid: "",
      price: "",
    },
  });

  const { mutate, isLoading } = useMutation((data: any) => eventsCreate(data), {
    onMutate: () => {
      toast.info("events creating", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("events created", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-events");
      closefn();
    },
    onError: () => {
      toast.error("events not created", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const rel8EventMutResult = useMutation(rel8Event, {
    onMutate: () => {
      toast.info("posting event to Rel8");
    },
    onError: () => {
      toast.error("failed to post event to Rel8");
    },
    onSuccess: () => {
      toast.success("event posted on Rel8");
    },
  });

  const onSubmitHandler = (dataInput: InputDataType) => {
    let { to_rel8, ...data } = dataInput;
    if (to_rel8 === "yes") {
      if (!rel8UserData?.token) {
        setLoginModal(true);
        return null;
      } else {
        const rel8FormData = new FormData();
        rel8FormData.append("name", data.name);
        rel8FormData.append("is_paid_event", data.is_paid);
        rel8FormData.append("re_occuring", "false");
        rel8FormData.append("is_virtual", "false");
        rel8FormData.append("is_active", "true");
        rel8FormData.append("amount", `${data.price ? data.price : "0.00"}`);
        rel8FormData.append(
          "startDate",
          datefromatter(data.start_date as Date)
        );
        rel8FormData.append("startTime", "00:00");
        rel8FormData.append("address", data.location);
        rel8FormData.append("image", data.image[0]);
        rel8FormData.append("scheduletype", "day_of_week");
        rel8FormData.append("schedule", JSON.stringify(["0"]));
        rel8FormData.append("is_for_excos", "false");

        rel8EventMutResult.mutateAsync(rel8FormData);
      }
    }

    if (data.is_paid == "true") {
      data.end_date = datefromatter(data.end_date as Date);
      data.start_date = datefromatter(data.start_date as Date);
      let { image, is_current_agm, ...payload } = data;
      image = image[0];
      const FormDataHandler = new FormData();
      FormDataHandler.append("image", image);
      if (data?.is_agm === "true") {
        FormDataHandler.append("is_current_agm", is_current_agm as string);
      } else {
        FormDataHandler.append("is_current_agm", "false");
      }
      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      mutate(FormDataHandler);
    } else {
      data.end_date = datefromatter(data.end_date as Date);
      data.start_date = datefromatter(data.start_date as Date);
      let { image, price, is_current_agm, ...payload } = data;
      image = image[0];
      const FormDataHandler = new FormData();
      FormDataHandler.append("image", image);
      if (data?.is_agm === "true") {
        FormDataHandler.append("is_current_agm", is_current_agm as string);
      } else {
        FormDataHandler.append("is_current_agm", "false");
      }
      Object.keys(payload)?.forEach((key) =>
        //@ts-ignore
        FormDataHandler.append(key, payload[key])
      );
      mutate(FormDataHandler);
    }
  };
  return (
    <>
      {loginModal && <Rel8LoginModal closefn={() => setLoginModal(false)} />}
      {!loginModal && (
        <ModalsContainer>
          {isLoading || rel8EventMutResult.isLoading ? (
            <Loading
              light
              loading={isLoading || rel8EventMutResult.isLoading}
            />
          ) : (
            <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <h2>Create an Event</h2>
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
              <FormError>{errors?.is_paid?.message}</FormError>
              <FormSelect>
                <label>
                  Is this a paid event
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
              <FormError>{errors?.is_agm?.message}</FormError>
              <FormSelect>
                <label>
                  Is this event an Annual General Meeting
                  <br />
                  <select
                    defaultValue={""}
                    {...register("is_agm", { required: true })}
                  >
                    <option disabled>select an option</option>
                    <option value={"true"}>Yes</option>
                    <option value={"false"}>No</option>
                  </select>
                </label>
              </FormSelect>

              <FormSelect>
                <label>
                  Should this be set as the current Annual General Meeting
                  <br />
                  <small>
                    Note that this can still be set as the current AGM Event
                    later from the AGM Section
                  </small>
                  <br />
                  <select defaultValue={""} {...register("is_current_agm")}>
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
                  End Date
                  <br />
                  <input
                    type="date"
                    {...register("end_date", { required: true })}
                  />
                </label>
              </FormInput>

              <section>
                <Header>
                  <h3>Also create this event on rel8?</h3>
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
                <CustomModalButton isDisabled={false}>CREATE</CustomModalButton>
              </div>
            </Form>
          )}
        </ModalsContainer>
      )}
    </>
  );
};

export default CreateEventModal;
