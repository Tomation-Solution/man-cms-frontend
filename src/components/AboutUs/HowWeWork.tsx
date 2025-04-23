import React, { useEffect, useState } from "react";
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
import { validateUnorderedListOnly } from "../../utils";
import BoxWithHeading from "../BoxWithHeading";
import AdvancedEditor from "../TextEditor/AdvancedQuill";
import InputWithLabel from "../InputWithLabel/InputWithLabel";

const schema = yup.object({
  how_we_work_header: yup.string(),
  how_we_work: yup.string(),
  how_we_work_details: yup.string(),
  committees_header: yup.string(),
  committees: yup.string(),
  committee_details: yup.string(),
  adhoc_header: yup.string(),
  adhoc: yup.string(),
  spvehicles_header: yup.string(),
  spvehicles: yup.string(),
  spgroups_header: yup.string(),
  spgroups: yup.string(),
  conduct_header: yup.string(),
  conduct: yup.string(),
  conduct_listing_header: yup.string(),
  conduct_listing: yup.string(),
});

const HowWeWork = () => {
  const queryClient = useQueryClient();
  const [howWeWork, setHowWeWork] = useState("");
  const [howWeWorkDetails, setHowWeWorkDetails] = useState("");

  const [committees, setCommittees] = useState("");
  const [committeeDetails, setCommitteeDetails] = useState("");
  const [adhoc, setAdhoc] = useState("");
  const [spVehicles, setSpVehicles] = useState("");

  const [spGroups, setSpGroups] = useState("");
  const [conduct, setConduct] = useState("");
  const [conductListing, setConductListing] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      main_image: null,
      how_we_work_header: "",
      how_we_work: "",
      how_we_work_details: "",
      committees_header: "",
      committees: "",
      committee_details: "",
      adhoc_header: "",
      adhoc: "",
      spvehicles_header: "",
      spvehicles: "",
      spgroups_header: "",
      spgroups: "",
      conduct_header: "",
      conduct: "",
      conduct_listing_header: "",
      conduct_listing: "",
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
        how_we_work_header: data.how_we_work_header,
        how_we_work: data.how_we_work,
        how_we_work_details: data.how_we_work_details,

        committees_header: data.committees_header,
        committees: data.committees,
        committee_details: data.committee_details,

        adhoc_header: data.adhoc_header,
        adhoc: data.adhoc,

        spvehicles_header: data.spvehicles_header,
        spvehicles: data.spvehicles,

        spgroups_header: data.spgroups_header,
        spgroups: data.spgroups,

        conduct_header: data.conduct_header,
        conduct: data.conduct,

        conduct_listing_header: data.conduct_listing_header,
        conduct_listing: data.conduct_listing,
      };

      setHowWeWork(data.how_we_work || "");
      setHowWeWorkDetails(data.how_we_work_details || "");
      setCommittees(data.committees || "");
      setCommitteeDetails(data.committee_details || "");
      setAdhoc(data.adhoc || "");
      setSpVehicles(data.spvehicles || "");
      setSpGroups(data.spgroups || "");
      setConduct(data.conduct || "");
      setConductListing(data.conduct_listing || "");

      reset(main_data);
    }
  }, [reset, data]);

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

    let errorThrown = false;
    Object.keys(payload)?.forEach((key) => {
      //@ts-ignore
      return FormDataHandler.append(key, payload[key]);
    });

    if (!errorThrown) mutate(FormDataHandler);
  };

  const previousMainCoreImage = getValues("main_image");

  return (
    <>
      <ModalsContainer>
        <Loading loading={dataLoading || isLoading || isFetching} />
        {!isError ? (
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            <h2>Edit How We Work Data</h2>
            <small>
              PS: If a section's header is not filled it will be omited from the
              website
            </small>
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
            <BoxWithHeading heading="How We Work Paragraphs*">
              <InputWithLabel
                label="Header"
                register={register("how_we_work_header")}
              />
              <br />
              <AdvancedEditor
                value={howWeWork}
                onChange={(newContent: string) => {
                  setHowWeWork(newContent);
                  setValue("how_we_work", newContent, { shouldValidate: true });
                }}
              />
              <FormError>{errors?.how_we_work?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="How We Work Details*">
              <AdvancedEditor
                value={howWeWorkDetails}
                onChange={(newContent: string) => {
                  setHowWeWorkDetails(newContent);
                  setValue("how_we_work_details", newContent, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormError>{errors?.how_we_work_details?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="Committees*">
              <InputWithLabel
                label="Header"
                register={register("committees_header")}
              />
              <br />
              <AdvancedEditor
                onlyList
                value={committees}
                onChange={(newContent: string) => {
                  setCommittees(newContent);
                  setValue("committees", newContent, { shouldValidate: true });
                }}
              />
              <FormError>{errors?.committees?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="Committee Details*">
              <AdvancedEditor
                value={committeeDetails}
                onChange={(newContent: string) => {
                  setCommitteeDetails(newContent);
                  setValue("committee_details", newContent, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormError>{errors?.committee_details?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="Adhoc*">
              <InputWithLabel
                label="Header"
                register={register("adhoc_header")}
              />
              <br />
              <AdvancedEditor
                value={adhoc}
                onChange={(newContent: string) => {
                  setAdhoc(newContent);
                  setValue("adhoc", newContent, { shouldValidate: true });
                }}
              />
              <FormError>{errors?.adhoc?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="SP Vehicles*">
              <InputWithLabel
                label="Header"
                register={register("spvehicles_header")}
              />
              <br />
              <AdvancedEditor
                value={spVehicles}
                onChange={(newContent: string) => {
                  setSpVehicles(newContent);
                  setValue("spvehicles", newContent, { shouldValidate: true });
                }}
              />
              <FormError>{errors?.spvehicles?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="SP Groups*">
              <InputWithLabel
                label="Header"
                register={register("spgroups_header")}
              />
              <br />
              <AdvancedEditor
                value={spGroups}
                onChange={(newContent: string) => {
                  setSpGroups(newContent);
                  setValue("spgroups", newContent, { shouldValidate: true });
                }}
              />
              <FormError>{errors?.spgroups?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="Conduct*">
              <InputWithLabel
                label="Header"
                register={register("conduct_header")}
              />
              <br />
              <AdvancedEditor
                value={conduct}
                onChange={(newContent: string) => {
                  setConduct(newContent);
                  setValue("conduct", newContent, { shouldValidate: true });
                }}
              />
              <FormError>{errors?.conduct?.message}</FormError>
            </BoxWithHeading>

            <BoxWithHeading heading="Conduct Listing*">
              <InputWithLabel
                label="Header"
                register={register("conduct_listing_header")}
              />
              <br />
              <AdvancedEditor
                onlyList
                value={conductListing}
                onChange={(newContent: string) => {
                  setConductListing(newContent);
                  setValue("conduct_listing", newContent, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormError>{errors?.conduct_listing?.message}</FormError>
            </BoxWithHeading>

            {Object.keys(errors).length > 0 && (
              <FormError>
                {Object.entries(errors).map(([key, error]) => (
                  <div key={key}>
                    <br />
                    {error?.message}
                  </div>
                ))}
              </FormError>
            )}
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
