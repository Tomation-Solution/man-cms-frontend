import React, { useEffect } from "react";
import { Form, FormError, FormInput } from "../../globals/styles/forms.styles";
import { useForm, useFieldArray } from "react-hook-form";
import Button from "../Button/Button";
import {
  AddMoreButton,
  SelectImage,
} from "../../globals/styles/CustomFormComponents";
import { ModalsContainer } from "../Modals/Modals.styles";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { historyRetrieve, historyUpdate } from "../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";

const schema = yup.object({
  //   main_image: yup.mixed().required(),
  //   history_image: yup.mixed().required(),
  //   mission_image: yup.mixed().required(),
  //   vision_image: yup.mixed().required(),
  history_paragraphs: yup
    .array()
    .min(1, "Please add atleast one history paragraph"),
  core_values: yup
    .array()
    .min(1, "Please add atleast one core values paragraph"),
  vision: yup.array().min(1, "Please add atleast one vision paragraph"),
  mission: yup.array().min(1, "Please add atleast one mission paragraph"),
  objectives: yup.array().min(1, "Please add atleast one objectives paragraph"),
  extras: yup.array().min(1, "Please add atleast one extras paragraph"),
});

const History = () => {
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
      history_image: null,
      mission_image: null,
      vision_image: null,
      history_paragraphs: ["NEW HISTORY PARAGRAPH"],
      core_values: ["NEW CORE VALUE PARAGRAPH"],
      vision: ["NEW VISION PARAGRAPH"],
      mission: ["NEW MISSION PARAGRAPH"],
      objectives: ["NEW OBJECTIVE PARAGRAPH"],
      extras: ["NEW EXTRAS PARAGRAPH"],
    },
  });

  const { fields, append, remove } = useFieldArray({
    //@ts-ignore
    name: "history_paragraphs",
    control,
    rules: {
      required: "Please add atleast one history paragraph",
    },
  });
  const {
    fields: corefields,
    append: coreappend,
    remove: coreremove,
  } = useFieldArray({
    //@ts-ignore
    name: "core_values",
    control,
    rules: {
      required: "Please add atleast one core paragraph",
    },
  });
  const {
    fields: visionfields,
    append: visionappend,
    remove: visionremove,
  } = useFieldArray({
    //@ts-ignore
    name: "vision",
    control,
    rules: {
      required: "Please add atleast one vision paragraph",
    },
  });
  const {
    fields: missionfields,
    append: missionappend,
    remove: missionremove,
  } = useFieldArray({
    //@ts-ignore
    name: "mission",
    control,
    rules: {
      required: "Please add atleast one mission paragraph",
    },
  });
  const {
    fields: objectivefields,
    append: objectiveappend,
    remove: objectiveremove,
  } = useFieldArray({
    //@ts-ignore
    name: "objectives",
    control,
    rules: {
      required: "Please add atleast one objectives paragraph",
    },
  });
  const {
    fields: extrasfields,
    append: extrasappend,
    remove: extrasremove,
  } = useFieldArray({
    //@ts-ignore
    name: "extras",
    control,
    rules: {
      required: "Please add atleast one extras paragraph",
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

    let { main_image, history_image, mission_image, vision_image, ...payload } =
      data;

    if (
      typeof data.main_image !== "string" &&
      data.main_image instanceof FileList
    ) {
      main_image = main_image[0];
      FormDataHandler.append("main_image", main_image);
    }
    if (
      typeof data.history_image !== "string" &&
      data.history_image instanceof FileList
    ) {
      history_image = history_image[0];
      FormDataHandler.append("history_image", history_image);
    }
    if (
      typeof data.mission_image !== "string" &&
      data.mission_image instanceof FileList
    ) {
      mission_image = mission_image[0];
      FormDataHandler.append("mission_image", mission_image);
    }
    if (
      typeof data.vision_image !== "string" &&
      data.vision_image instanceof FileList
    ) {
      vision_image = vision_image[0];
      FormDataHandler.append("vision_image", vision_image);
    }

    Object.keys(payload)?.forEach((key) =>
      //@ts-ignore
      FormDataHandler.append(key, JSON.stringify(payload[key]))
    );
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

            {fields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    History Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`history_paragraphs.${index}`, {
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
            <FormError>{errors?.history_paragraphs?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => append("NEW_PARAGRAPH")}
            >
              Add More History Paragraphs
            </AddMoreButton>

            {corefields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Core Values Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`core_values.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => coreremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.core_values?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => coreappend("NEW_PARAGRAPH")}
            >
              Add More Core Values Paragraphs
            </AddMoreButton>

            {visionfields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Vision Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`vision.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => visionremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.vision?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => visionappend("NEW_PARAGRAPH")}
            >
              Add More Vision Paragraphs
            </AddMoreButton>

            {missionfields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Mission Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`mission.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => missionremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.mission?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => missionappend("NEW_PARAGRAPH")}
            >
              Add More Mission Paragraphs
            </AddMoreButton>

            {objectivefields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Objectives Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`objectives.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => objectiveremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.objectives?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => objectiveappend("NEW_PARAGRAPH")}
            >
              Add More Objectives Paragraphs
            </AddMoreButton>

            {extrasfields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Extras Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`extras.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => extrasremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.extras?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => extrasappend("NEW_PARAGRAPH")}
            >
              Add More Extras Paragraphs
            </AddMoreButton>

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
