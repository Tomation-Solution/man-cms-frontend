import { toast } from "react-toastify";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useMediaQuery } from "react-responsive";
import Button from "../../../components/Button/Button";
import {
  getMrcContactPage,
  updateMrcContactPageApi,
} from "../../../axios/api-calls";
import Loading from "../../../components/Loading/Loading";
import InputWithLabel from "../../../components/InputWithLabel/InputWithLabel";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BoxWithHeading from "../../../components/BoxWithHeading";
import AdvancedEditor from "../../../components/TextEditor/AdvancedQuill";

const MrcContactPageSchema = yup.object({
  get_in_touch_header: yup.string().required(),
  get_in_touch_desc: yup.string().required(),
  address_header: yup.string().required(),
  address: yup.string().required(),
  phone: yup.string().required(),
  email: yup.string().required(),
  link_text: yup.string().required(),
  business_hours_header: yup.string().required(),
  business_hours: yup.string().required(),
});

export type MrcContactPageSchemaType = yup.InferType<
  typeof MrcContactPageSchema
>;

export const MRCContactPage = () => {
  const [getInTouchDesc, setGetInTouchDesc] = useState("");
  const [businessHours, setBusinessHours] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MrcContactPageSchemaType>({
    resolver: yupResolver(MrcContactPageSchema),
  });

  const { isLoading, data } = useQuery("mrc-contact-page", getMrcContactPage, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (data) {
        console.log(data);
        setValue("get_in_touch_header", data?.get_in_touch_header);
        setValue("get_in_touch_desc", data?.get_in_touch_desc);
        setValue("address_header", data?.address_header);
        setValue("address", data?.address);
        setValue("phone", data?.phone);
        setValue("email", data?.email);
        setValue("link_text", data?.link_text);
        setValue("business_hours_header", data?.business_hours_header);
        setValue("business_hours", data?.business_hours);

        setGetInTouchDesc(data?.get_in_touch_desc);
        setBusinessHours(data?.business_hours);
      }
    },
  });

  const { mutate, isLoading: editing } = useMutation(updateMrcContactPageApi, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("mrc-contact-page");
      toast.success("Update Success", {
        progressClassName: "toastProgress",
        icon: false,
      });
    },
  });

  const onSubmitHandler = (data: MrcContactPageSchemaType) => {
    console.log({ SubmittedData: data });

    mutate(data);
  };

  return (
    <div>
      {/* <Loading loading={isLoading||deleting} /> */}

      <Loading loading={isLoading || editing} />
      <h2>MRC Contact page content</h2>

      {/* Objectives */}
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <br />
        {/* objectives_ca */}
        <BoxWithHeading heading="Get In Touch Section">
          <br />
          <InputWithLabel
            label="Header"
            register={register(`get_in_touch_header`)}
          />
          <br />
          <AdvancedEditor
            value={getInTouchDesc}
            onChange={(val: string) => {
              setGetInTouchDesc(val);
              setValue("get_in_touch_desc", val, { shouldValidate: true });
            }}
          />
        </BoxWithHeading>

        <BoxWithHeading heading="Address Section">
          <br />
          <InputWithLabel
            label="Header"
            register={register(`address_header`)}
          />
          <br />
          <InputWithLabel label="Address" register={register(`address`)} />
          <br />
          <InputWithLabel label="Phone" register={register(`phone`)} />
          <br />
          <InputWithLabel label="email" register={register(`email`)} />
          <br />
          <InputWithLabel label="link Text" register={register(`link_text`)} />
        </BoxWithHeading>

        <BoxWithHeading heading="Objectives">
          <br />
          <InputWithLabel
            label="Header"
            register={register(`business_hours_header`)}
          />
          <AdvancedEditor
            onlyList
            value={businessHours}
            onChange={(val: string) => {
              setBusinessHours(val);
              setValue("business_hours", val, { shouldValidate: true });
            }}
          />
        </BoxWithHeading>
        <Button style={{ width: "100%", marginTop: "2rem" }} styleType="pry">
          EDIT
        </Button>
      </form>
    </div>
  );
};
