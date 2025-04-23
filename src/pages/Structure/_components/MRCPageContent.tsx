import { toast } from "react-toastify";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useMediaQuery } from "react-responsive";
import Button from "../../../components/Button/Button";
import { getMrcPage, updateMrcPageApi } from "../../../axios/api-calls";
import Loading from "../../../components/Loading/Loading";
import InputWithLabel from "../../../components/InputWithLabel/InputWithLabel";
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BoxWithHeading from "../../../components/BoxWithHeading";
import { AddMoreButton } from "../../../globals/styles/CustomFormComponents";
import AdvancedEditor from "../../../components/TextEditor/AdvancedQuill";

const MrcPageContentTabschema = yup.object({
  banner_image: yup.mixed(),
  objectives_card: yup.array().of(
    yup.object({
      header: yup.string().required(),
      description: yup.string().required(),
    })
  ),
  who_we_are: yup.string().required(),
  objectives: yup.string().required(),
});
export type MrcPageContentTabschemaType = yup.InferType<
  typeof MrcPageContentTabschema
>;
export const MrcPageContentTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  const [whoWeAre, setWhoWeAre] = useState("");
  const [objectives, setObjectives] = useState("");
  const [currentData, setCurrentData] = useState<any>();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MrcPageContentTabschemaType>({
    resolver: yupResolver(MrcPageContentTabschema),
  });

  const {
    fields: objectivesCardField,
    append,
    remove,
  } = useFieldArray({
    name: "objectives_card",
    control,
  });

  const { isLoading, data } = useQuery("mrc-page", getMrcPage, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (data) {
        console.log(data);
        setValue("objectives_card", data.objectives_card);
        setValue("who_we_are", data?.who_we_are);
        setValue("objectives", data?.objectives);
        setValue("banner_image", data?.banner_image);

        setWhoWeAre(data?.who_we_are);
        setObjectives(data?.objectives);
      }
    },
  });
  const { mutate, isLoading: editing } = useMutation(updateMrcPageApi, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("mrc-page");
      toast.success("Update Success", {
        progressClassName: "toastProgress",
        icon: false,
      });
    },
  });
  //

  const onSubmitHandler = (data: MrcPageContentTabschemaType) => {
    console.log({ SUbmittedData: data });

    mutate(data);
  };

  return (
    <div>
      {/* <Loading loading={isLoading||deleting} /> */}

      <Loading loading={isLoading || editing} />
      <h2>MRC page content</h2>

      {/* Objectives */}
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <br />
        <div style={{ margin: "0 10px" }}>
          <img
            src={data?.banner_image ?? ""}
            style={{ width: "75px", aspectRatio: "16/7" }}
            alt=""
          />
          <InputWithLabel
            register={register("banner_image")}
            label="Banner Image (Aspect Ratio 16:7)"
            type="file"
          />
        </div>

        {/* objectives_ca */}
        <BoxWithHeading heading="Objectives Card">
          <br />
          {objectivesCardField.map((d, index) => (
            <>
              <InputWithLabel
                //  register={}
                label="Card header"
                register={register(`objectives_card.${index}.header`)}
              />
              <InputWithLabel
                //  register={}
                label="Description"
                register={register(`objectives_card.${index}.description`)}
              />
              <Button
                styleType={"whiteBg"}
                onClick={() => {
                  remove(index);
                }}
              >
                DELETE
              </Button>
              <br />
            </>
          ))}
          <AddMoreButton
            justify="center"
            click={() => {
              append({ description: "", header: "heading" });
            }}
          >
            Add More
          </AddMoreButton>
        </BoxWithHeading>

        <BoxWithHeading heading="Who We Are">
          <AdvancedEditor
            value={whoWeAre}
            onChange={(val: string) => {
              setWhoWeAre(val);
              setValue("who_we_are", val, { shouldValidate: true });
            }}
          />
        </BoxWithHeading>

        <BoxWithHeading heading="Objectives">
          <AdvancedEditor
            onlyList
            value={objectives}
            onChange={(val: string) => {
              setObjectives(val);
              setValue("objectives", val, { shouldValidate: true });
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
