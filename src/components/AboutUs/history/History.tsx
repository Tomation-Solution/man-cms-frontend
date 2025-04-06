import React, { useEffect, useState } from "react";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { useForm, useFieldArray } from "react-hook-form";
import Button from "../../Button/Button";
import {
  AddMoreButton,
  SelectImage,
} from "../../../globals/styles/CustomFormComponents";
import { ModalsContainer } from "../../Modals/Modals.styles";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { historyRetrieve, historyUpdate } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import BoxWithHeading from "../../BoxWithHeading";
import AdvancedEditor from "../../TextEditor/AdvancedQuill";
import { containsActualText, validateUnorderedListOnly } from "../../../utils";

const schema = yup.object({
  //   main_image: yup.mixed().required(),
  //   history_image: yup.mixed().required(),
  //   mission_image: yup.mixed().required(),
  //   vision_image: yup.mixed().required(),
  history_paragraphs: yup.string().required(),
  core_values: yup.string().required(),
  vision: yup.string().required(),
  mission: yup.string().required(),
  objectives: yup.string().required(),
  extras: yup.string().required(),
});

const History = () => {
  const [historyParagraphs, setHistoryParagraphs] = useState<string>("");
  const [coreValues, setCoreValues] = useState<string>("");
  const [vision, setVision] = useState<string>("");

  const [mission, setMission] = useState<string>("");
  const [objectives, setObjectives] = useState<string>("");
  const [extras, setExtras] = useState<string>("");

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      main_image: null,
      history_image: null,
      mission_image: null,
      vision_image: null,
      history_paragraphs: "",
      core_values: "",
      vision: "",
      mission: "",
      objectives: "",
      extras: "",
    },
  });

  const {
    isLoading: historyLoading,
    isFetching,
    isError,
    data,
  } = useQuery("aboutus-history", historyRetrieve, {
    refetchOnWindowFocus: false,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        main_image: data.main_image,
        history_image: data.history_image,
        mission_image: data.mission_image,
        vision_image: data.vision_image,
        history_paragraphs: data.history_paragraphs,
        core_values: data.core_values,
        vision: data.vision,
        mission: data.mission,
        objectives: data.objectives,
        extras: data.extras,
      };

      // Setting state variables
      setHistoryParagraphs(data.history_paragraphs);
      setCoreValues(data.core_values);
      setVision(data.vision);
      setMission(data.mission);
      setObjectives(data.objectives);
      setExtras(data.extras);

      reset(main_data);
    }
  }, [reset, data]);

  const { mutate, isLoading } = useMutation(
    (data: any) => historyUpdate(data),
    {
      onMutate: () => {
        toast.info("about history edits saving...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("about history edits saved", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("aboutus-history");
      },
      onError: () => {
        toast.error("about history not edited", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const onSubmitHandler = (data: any) => {
    const FormDataHandler = new FormData();

    // Extract images
    const imageFields = [
      "main_image",
      "history_image",
      "mission_image",
      "vision_image",
    ];
    imageFields.forEach((field) => {
      if (typeof data[field] !== "string" && data[field] instanceof FileList) {
        FormDataHandler.append(field, data[field][0]);
      }
    });

    // Extract text fields
    const textFields = [
      "history_paragraphs",
      "core_values",
      "vision",
      "mission",
      "objectives",
      "extras",
    ];

    textFields.forEach((field) => {
      const value = data[field];

      if (!containsActualText(value)) {
        setError(
          field as
            | "history_paragraphs"
            | "core_values"
            | "vision"
            | "mission"
            | "objectives"
            | "extras",
          {
            type: "manual",
            message: "This field cannot be empty.",
          }
        );
        return;
      }

      if (
        ["core_values", "objectives"].includes(field) &&
        !validateUnorderedListOnly(value)
      ) {
        setError(field as "core_values" | "objectives", {
          type: "manual",
          message: "Must be an unordered list.",
        });
        return;
      }

      FormDataHandler.append(field, value);
    });

    mutate(FormDataHandler);
  };

  const previousMainCoreImage = getValues("main_image");
  const previousHistoryImage = getValues("history_image");
  const previousVisionImage = getValues("mission_image");
  const previousMissionImage = getValues("vision_image");

  return (
    <>
      <ModalsContainer>
        <Loading loading={isLoading || historyLoading || isFetching} />
        {!isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Edit History Data</h2>
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

            <FormInput>
              <SelectImage image={`${previousHistoryImage}`} />
              <label>
                History Image
                <br />
                <input
                  type="file"
                  accept="image/*"
                  {...register("history_image", { required: false })}
                />
              </label>
            </FormInput>

            <FormInput>
              <SelectImage image={`${previousMissionImage}`} />
              <label>
                Mission Image
                <br />
                <input
                  type="file"
                  accept="image/*"
                  {...register("mission_image", { required: false })}
                />
              </label>
            </FormInput>

            <FormInput>
              <SelectImage image={`${previousVisionImage}`} />
              <label>
                Vision Image
                <br />
                <input
                  type="file"
                  accept="image/*"
                  {...register("vision_image", { required: false })}
                />
              </label>
            </FormInput>

            <BoxWithHeading heading="History Paragraphs*">
              <AdvancedEditor
                value={historyParagraphs}
                onChange={(newContent: string) => {
                  setHistoryParagraphs(newContent);
                  setValue("history_paragraphs", newContent, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormError>{errors?.history_paragraphs?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="Core Values*">
              <AdvancedEditor
                onlyList
                value={coreValues}
                onChange={(newContent: string) => {
                  setCoreValues(newContent);
                  setValue("core_values", newContent, { shouldValidate: true });
                }}
              />
              <FormError>{errors?.core_values?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="Vision*">
              <AdvancedEditor
                value={vision}
                onChange={(newContent: string) => {
                  setVision(newContent);
                  setValue("vision", newContent, { shouldValidate: true });
                }}
              />
              <FormError>{errors?.vision?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="Mission*">
              <AdvancedEditor
                value={mission}
                onChange={(newContent: string) => {
                  setMission(newContent);
                  setValue("mission", newContent, { shouldValidate: true });
                }}
              />
              <FormError>{errors?.mission?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="Objectives*">
              <AdvancedEditor
                onlyList
                value={objectives}
                onChange={(newContent: string) => {
                  setObjectives(newContent);
                  setValue("objectives", newContent, { shouldValidate: true });
                }}
              />
              <FormError>{errors?.objectives?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="Extras*">
              <AdvancedEditor
                value={extras}
                onChange={(newContent: string) => {
                  setExtras(newContent);
                  setValue("extras", newContent, { shouldValidate: true });
                }}
              />
              <FormError>{errors?.extras?.message}</FormError>
            </BoxWithHeading>

            <br />
            <Button styleType="pry">EDIT</Button>
          </Form>
        ) : (
          <FormError>Cant Fetch About History Data</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default History;
