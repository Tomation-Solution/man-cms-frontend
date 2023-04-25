import React, { useEffect } from "react";
import { ModalsContainer } from "../Modals/Modals.styles";
import { Form, FormError, FormInput } from "../../globals/styles/forms.styles";
import Button from "../Button/Button";
import {
  AddMoreButton,
  SelectImage,
} from "../../globals/styles/CustomFormComponents";
import Loading from "../Loading/Loading";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useForm, useFieldArray } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { howWeWorkRetrieve, howWeWorkUpdate } from "../../axios/api-calls";
import { toast } from "react-toastify";

const schema = yup.object({
  how_we_work: yup
    .array()
    .min(1, "Please add atleast one how we work paragraph"),
  how_we_work_details: yup
    .array()
    .min(1, "Please add atleast how we work details paragraph"),
  committees: yup.array().min(1, "Please add atleast one committees paragraph"),
  committee_details: yup
    .array()
    .min(1, "Please add atleast one committee details paragraph"),
  adhoc: yup.array().min(1, "Please add atleast one adhoc paragraph"),
  spvehicles: yup.array().min(1, "Please add atleast one spvehicles paragraph"),
  spgroups: yup.array().min(1, "Please add atleast one spgroups paragraph"),
  conduct: yup.array().min(1, "Please add atleast one conduct paragraph"),
  conduct_listing: yup
    .array()
    .min(1, "Please add atleast conduct listing ops paragraph"),
});

const HowWeWork = () => {
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
      how_we_work: ["NEW HOW WE WORK PARAGRAPH"],
      how_we_work_details: ["NEW HOW WE WORK DETAILS PARAGRAPH"],
      committees: ["NEW HOW WE COMMITTEES PARAGRAPH"],
      committee_details: ["NEW COMMITTEES DETAILS PARAGRAPH"],
      adhoc: ["NEW ADHOC PARAGRAPH"],
      spvehicles: ["NEW SPVEHICLES PARAGRAPH"],
      spgroups: ["NEW SPGROUPS PARAGRAPH"],
      conduct: ["NEW CONDUCT PARAGRAPH"],
      conduct_listing: ["NEW CONDUCT LISTING PARAGRAPH"],
    },
  });

  const {
    isLoading: dataLoading,
    isFetching,
    isError,
    data,
  } = useQuery("aboutus-how-we-work", howWeWorkRetrieve, {
    refetchOnWindowFocus: false,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (data) {
      const main_data = {
        main_image: data.main_image,
        how_we_work: data.how_we_work,
        how_we_work_details: data.how_we_work_details,
        committees: data.committees,
        committee_details: data.committee_details,
        adhoc: data.adhoc,
        spvehicles: data.spvehicles,
        spgroups: data.spgroups,
        conduct: data.conduct,
        conduct_listing: data.conduct_listing,
      };
      reset(main_data);
    }
  }, [reset, data]);

  const { fields, append, remove } = useFieldArray({
    //@ts-ignore
    name: "how_we_work",
    control,
    rules: {
      required: "Please add atleast one how we work paragraph",
    },
  });

  const {
    fields: howdetails,
    append: howappend,
    remove: howremove,
  } = useFieldArray({
    //@ts-ignore
    name: "how_we_work_details",
    control,
    rules: {
      required: "Please add atleast one how we work details paragraph",
    },
  });

  const {
    fields: committeesfields,
    append: committeesappend,
    remove: committeesremove,
  } = useFieldArray({
    //@ts-ignore
    name: "committees",
    control,
    rules: {
      required: "Please add atleast one committees paragraph",
    },
  });

  const {
    fields: committeedetailsfields,
    append: committeedetailsappend,
    remove: committeedetailsremove,
  } = useFieldArray({
    //@ts-ignore
    name: "committee_details",
    control,
    rules: {
      required: "Please add atleast one committee details paragraph",
    },
  });

  const {
    fields: adhocfields,
    append: adhocappend,
    remove: adhocremove,
  } = useFieldArray({
    //@ts-ignore
    name: "adhoc",
    control,
    rules: {
      required: "Please add atleast one adhoc paragraph",
    },
  });

  const {
    fields: spvehiclesfields,
    append: spvehiclesappend,
    remove: spvehiclesremove,
  } = useFieldArray({
    //@ts-ignore
    name: "spvehicles",
    control,
    rules: {
      required: "Please add atleast one spvehicles paragraph",
    },
  });

  const {
    fields: spgroupsfields,
    append: spgroupsappend,
    remove: spgroupsremove,
  } = useFieldArray({
    //@ts-ignore
    name: "spgroups",
    control,
    rules: {
      required: "Please add atleast one spgroups paragraph",
    },
  });

  const {
    fields: conductfields,
    append: conductappend,
    remove: conductremove,
  } = useFieldArray({
    //@ts-ignore
    name: "conduct",
    control,
    rules: {
      required: "Please add atleast one conduct paragraph",
    },
  });

  const {
    fields: conductlistingdfields,
    append: conductlistingappend,
    remove: conductlistingremove,
  } = useFieldArray({
    //@ts-ignore
    name: "conduct_listing",
    control,
    rules: {
      required: "Please add atleast one conduct listing paragraph",
    },
  });

  const { mutate, isLoading } = useMutation(
    (data: any) => howWeWorkUpdate(data),
    {
      onMutate: () => {
        toast.info("how we work edits saving...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("how we work edits saved", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("aboutus-how-we-work");
      },
      onError: () => {
        toast.error("how we work not edited", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const onSubmitHandler = (data: any) => {
    console.log(data);

    const FormDataHandler = new FormData();

    let { main_image, ...payload } = data;

    if (
      typeof data.main_image !== "string" &&
      data.main_image instanceof FileList
    ) {
      main_image = main_image[0];
      FormDataHandler.append("main_image", main_image);
    }

    Object.keys(payload)?.forEach((key) =>
      //@ts-ignore
      FormDataHandler.append(key, JSON.stringify(payload[key]))
    );

    mutate(FormDataHandler);
  };

  const previousMainCoreImage = getValues("main_image");

  return (
    <>
      <ModalsContainer>
        <Loading loading={dataLoading || isLoading || isFetching} />
        {!isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Edit How We Work Data</h2>
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

            {fields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    How We Work Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`how_we_work.${index}`, {
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
            <FormError>{errors?.how_we_work?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => append("NEW_PARAGRAPH")}
            >
              Add More How We Work Paragraphs
            </AddMoreButton>

            {howdetails.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    How We Work Details Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`how_we_work_details.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => howremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.how_we_work_details?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => howappend("NEW_PARAGRAPH")}
            >
              Add More OPS Paragraphs
            </AddMoreButton>

            {committeesfields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Committes Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`committees.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => committeesremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.committees?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => committeesappend("NEW_PARAGRAPH")}
            >
              Add More Committes Paragraphs
            </AddMoreButton>

            {committeedetailsfields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Committes Details Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`committee_details.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => committeedetailsremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.committee_details?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => committeedetailsappend("NEW_PARAGRAPH")}
            >
              Add More Committes Details Paragraphs
            </AddMoreButton>

            {adhocfields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Ad-Hoc Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`adhoc.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => adhocremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.adhoc?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => adhocappend("NEW_PARAGRAPH")}
            >
              Add More Ad-Hoc Paragraphs
            </AddMoreButton>

            {spvehiclesfields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Sp Vehicles Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`spvehicles.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => spvehiclesremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.spvehicles?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => spvehiclesappend("NEW_PARAGRAPH")}
            >
              Add More Sp Vehicles Paragraphs
            </AddMoreButton>

            {spgroupsfields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Sp Groups Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`spgroups.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => spgroupsremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.spgroups?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => spgroupsappend("NEW_PARAGRAPH")}
            >
              Add More Sp Groups Paragraphs
            </AddMoreButton>

            {conductfields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Conduct Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`conduct.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => conductremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.conduct?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => conductappend("NEW_PARAGRAPH")}
            >
              Add More Conduct Paragraphs
            </AddMoreButton>

            {conductlistingdfields.map((fields, index) => (
              <section key={fields.id}>
                <FormInput>
                  <label>
                    Conduct Listing Paragraphs*
                    <br />
                    <textarea
                      style={{ backgroundColor: "#fff" }}
                      {...register(`conduct_listing.${index}`, {
                        required: true,
                      })}
                    />
                  </label>
                </FormInput>

                <div>
                  <Button
                    styleType={"whiteBg"}
                    onClick={() => conductlistingremove(index)}
                  >
                    DELETE
                  </Button>
                  <br />
                </div>
              </section>
            ))}
            <FormError>{errors?.conduct_listing?.message}</FormError>
            <AddMoreButton
              justify="center"
              click={() => conductlistingappend("NEW_PARAGRAPH")}
            >
              Add More Conduct Listing Paragraphs
            </AddMoreButton>

            <br />
            <Button styleType="pry">EDIT</Button>
          </Form>
        ) : (
          <FormError>Can't Fetch How We Work Details Data</FormError>
        )}
      </ModalsContainer>
    </>
  );
};

export default HowWeWork;
