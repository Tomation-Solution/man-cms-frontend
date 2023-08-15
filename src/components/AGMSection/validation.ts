import * as yup from "yup";
import AGMProgram from "./AGMProgram";
import { validateFileExtension } from "../../utils/extensionValidator";

export const AGMHomepageValidator = yup.object({
  main_image: yup.mixed().optional(),
  intro_text: yup.string().required("intro text is required"),
  location: yup.string().required("location is required"),
  agm_start_date: yup.string().required("agm start date is required"),
  countdown_text: yup.string().required("countdown text is required"),
  intro_title: yup.string().required("intro title is required"),
  intro_description: yup.string().required("intro description is required"),
  exhibition_text: yup.string().required("exhibition text is required"),
  exhibition_image: yup.mixed().optional(),
  save_date_text: yup.string().required("save date text is required"),
  save_date_image: yup.mixed().optional(),
  venue_text: yup.string().required("venue text is required"),
  venue_text_image: yup.mixed().optional(),
});

export type AGMHomepageValidatorType = yup.InferType<
  typeof AGMHomepageValidator
>;

export const AGMProgramValidator = yup.object({
  program_date: yup.string().required("program date is required"),
  program_title: yup.string().required("program title is required"),
  program_attached_file_link: yup
    .string()
    .url("program attached file link must be a url")
    .optional(),
  program_attached_file1: yup.mixed().notRequired(),
  program_attached_file2: yup.mixed().notRequired(),
});

export type AGMProgramValidatorType = yup.InferType<typeof AGMProgramValidator>;

export const AGMSpeakerValidator = yup.object({
  intro_text: yup.string().required(),
  header: yup.string().required(),
  speaker_title: yup.string().notRequired(),
  speaker_name: yup.string().required(),
  extra_title: yup.string().notRequired(),
  speaker_image: yup.mixed().notRequired(),
  speaker_words: yup.string().notRequired(),
});

export type AGMSpeakerValidatorType = yup.InferType<typeof AGMSpeakerValidator>;

export const AGMExhibitionValidator = yup.object({
  image: yup.mixed().test({
    message: "Image file is required",
    test: (file, context) => {
      if (!file) {
        return false;
      }
      const isValid = validateFileExtension(file);
      if (!isValid) {
        return isValid;
      }
      return isValid;
    },
  }),
  type: yup
    .string()
    .oneOf(["exhibition", "company"], "type must be a exhibition or company")
    .required(),
});

export type AGMExhibitionValidatorType = yup.InferType<
  typeof AGMExhibitionValidator
>;

export const AGMVenueValidator = yup.object({
  venue_image: yup.mixed().notRequired(),
  venue_location_text: yup.string().required(),
  venue_location_map: yup.string().required(),
});

export type AGMVenueValidatorType = yup.InferType<typeof AGMVenueValidator>;
