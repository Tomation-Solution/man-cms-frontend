import { useForm } from "react-hook-form";

import {
  getVenuePageContent,
  updateVenuePageContent,
} from "../../axios/api-calls";
import { customFetcher } from "../../utils/customFetcher";
import EmptyState from "../EmptyState/EmptyState";
import { AGMVenueType } from "./types";
import { yupResolver } from "@hookform/resolvers/yup";
import { AGMVenueValidator, AGMVenueValidatorType } from "./validation";
import Loading from "../Loading/Loading";
import Button from "../Button/Button";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { isFileListValidator } from "../../utils/extraFunction";
import InputWithLabel from "../InputWithLabel/InputWithLabel";
import { SelectImage } from "../../globals/styles/CustomFormComponents";
import { useEffect } from "react";

function AGMVenue() {
  const { loadingState, isError, data } = customFetcher<AGMVenueType>(
    "venue-details",
    getVenuePageContent
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AGMVenueValidatorType>({
    resolver: yupResolver(AGMVenueValidator),
  });

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation(updateVenuePageContent, {
    onSuccess: () => {
      queryClient.invalidateQueries("venue-details");
      toast.success("update sucessful");
    },
    onError: () => {
      toast.error("update failed");
    },
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        venue_image: data?.venue_image,
        venue_location_text: data?.venue_location_text,
        venue_location_map: data?.venue_location_map,
      };

      reset(main_data);
    }
  }, [reset, data]);

  const onSubmitHandler = (inputData: AGMVenueValidatorType) => {
    const { venue_image, ...payload } = inputData;

    const formData = new FormData();

    if (isFileListValidator(venue_image)) {
      //@ts-ignore
      formData.append("venue_image", venue_image[0]);
    }

    //@ts-ignore
    Object.keys(payload).forEach((key) => formData.append(key, payload[key]));

    mutate(formData);
  };

  if (loadingState) {
    return <EmptyState header="loading data" />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        header="Oops something went wrong"
        subHeader="try again later"
      />
    );
  }

  return (
    <>
      <Loading loading={isLoading} />

      <InputWithLabel
        label="Venue Location Intro Text"
        register={register("venue_location_text")}
        errorMessage={errors.venue_location_text?.message}
      />

      <SelectImage image={data?.venue_image} />

      <InputWithLabel
        label="Venue Image"
        type="file"
        accept="image/*"
        register={register("venue_image")}
        errorMessage={errors.venue_image?.message}
      />
      <InputWithLabel
        label="Map Location Iframe"
        register={register("venue_location_map")}
        errorMessage={errors.venue_location_map?.message}
      />

      <Button onClick={handleSubmit(onSubmitHandler)}>Save</Button>
    </>
  );
}

export default AGMVenue;
