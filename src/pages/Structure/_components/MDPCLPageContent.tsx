import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation } from "react-query";
import { toast } from "react-toastify";
import {
  getMPDCLPageContentApi,
  updateMPDCLPageContentApi,
} from "../../../axios/api-calls";
import BoxWithHeading from "../../../components/BoxWithHeading";
import Button from "../../../components/Button/Button";
import InputWithLabel from "../../../components/InputWithLabel/InputWithLabel";
import Loading from "../../../components/Loading/Loading";
import { AddMoreButton } from "../../../globals/styles/CustomFormComponents";
import * as yup from "yup";
import AdvancedEditor from "../../../components/TextEditor/AdvancedQuill";
import { useEffect, useState } from "react";

const MPDCLPageContentSchema = yup.object({
  id: yup.number(),
  renewable_items: yup
    .array()
    .of(
      yup.object({
        header: yup.string().required(),
        description: yup.string().required(),
      })
    )
    .min(1),
  who_we_are: yup.string().required(),
  our_objectives_header: yup.string(),
  renewable_image: yup.mixed(),
  renewable_desc: yup.string().required(),
  our_objectives_items: yup.string().required(),
});

export type MPDCLPageContentSchemaFormType = yup.InferType<
  typeof MPDCLPageContentSchema
>;
const MPDCLPageContent = () => {
  const [whoAreWe, setWhoAreWe] = useState("");
  const [renewableDesc, setRenewableDesc] = useState("");
  const [ourObjectiveItems, setOurObjectiveItems] = useState("");

  const { isLoading, data } = useQuery(
    "MPDCL-page-content",
    getMPDCLPageContentApi,
    {
      onSuccess: (data) => {
        if (data) {
          console.log({ "success data": data });
          setValue("renewable_items", data.data.renewable_items);
          setValue("who_we_are", data.data.who_we_are);
          setValue("our_objectives_header", data.data.our_objectives_header);
          setValue("renewable_image", data.data.renewable_image);
          setValue("renewable_desc", data.data.renewable_desc);
          setValue("our_objectives_items", data.data.our_objectives_items);

          setWhoAreWe(data.data.who_we_are || "");
          setOurObjectiveItems(data.data.our_objectives_items || "");
          setRenewableDesc(data.data.renewable_desc || "");
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: updating, mutate: updateContent } = useMutation(
    updateMPDCLPageContentApi,
    {
      onSuccess: (data) => {
        toast.success("Update Success", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onError: (error) => {
        console.log("Error thing", error);
      },
    }
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MPDCLPageContentSchemaFormType>({
    resolver: yupResolver(MPDCLPageContentSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "renewable_items",
    control,
  });

  const onSubmitHandler = (data: MPDCLPageContentSchemaFormType) => {
    console.log({ submited: data });
    updateContent(data);
  };
  return (
    <div>
      <Loading loading={isLoading || updating} />
      <h1>MPDCL page Content</h1>
      <br />
      <br />

      <form onSubmit={handleSubmit(onSubmitHandler)}>
        {fields.map((d, index) => (
          <BoxWithHeading heading="Renewable Items" key={index}>
            <div>
              <InputWithLabel
                label="header"
                register={register(`renewable_items.${index}.header`)}
              />
              <InputWithLabel
                register={register(`renewable_items.${index}.description`)}
                label="description"
                isTextArea={true}
              />
              <Button
                styleType={"whiteBg"}
                onClick={() => {
                  remove(index);
                }}
              >
                DELETE
              </Button>
            </div>
          </BoxWithHeading>
        ))}
        <AddMoreButton
          justify="center"
          click={() => {
            append({ description: "", header: "heading" });
          }}
        >
          Add More
        </AddMoreButton>

        <BoxWithHeading heading="Who we are">
          <AdvancedEditor
            value={whoAreWe}
            onChange={(newContent: string) => {
              setWhoAreWe(newContent);
              setValue("who_we_are", newContent, {
                shouldValidate: true,
              });
            }}
          />
        </BoxWithHeading>

        <BoxWithHeading heading="">
          <InputWithLabel
            label="our_objectives_header"
            register={register(`our_objectives_header`)}
          />
          <InputWithLabel
            label="renewable_image"
            register={register("renewable_image")}
            type="file"
          />
        </BoxWithHeading>

        <BoxWithHeading heading="Our Objectives Items">
          <AdvancedEditor
            onlyList
            value={ourObjectiveItems}
            onChange={(newContent: string) => {
              setOurObjectiveItems(newContent);
              setValue("our_objectives_items", newContent, {
                shouldValidate: true,
              });
            }}
          />
        </BoxWithHeading>

        <BoxWithHeading heading="Renewable Desc">
          <AdvancedEditor
            onlyList
            value={renewableDesc}
            onChange={(newContent: string) => {
              setRenewableDesc(newContent);
              setValue("renewable_desc", newContent, {
                shouldValidate: true,
              });
            }}
          />
        </BoxWithHeading>
        <Button style={{ width: "100%", marginTop: "2rem" }}>Update</Button>
      </form>
    </div>
  );
};

export default MPDCLPageContent;
