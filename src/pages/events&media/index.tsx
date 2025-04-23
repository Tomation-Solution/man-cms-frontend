import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
  getMediaAndEventContent,
  updateMediaAndEventContent,
} from "../../axios/api-calls";
import BoxWithHeading from "../../components/BoxWithHeading";
import Button from "../../components/Button/Button";
import InputWithLabel from "../../components/InputWithLabel/InputWithLabel";
import Loading from "../../components/Loading/Loading";
import AdvancedEditor from "../../components/TextEditor/AdvancedQuill";
import { FormError } from "../../globals/styles/forms.styles";

const EventAndMediaContentSchema = yup.object({
  banner_image: yup.mixed().required(),
  main_image: yup.mixed().required(),

  news_image: yup.mixed().required(),
  news_title: yup.string().required(),
  news_description: yup.string().required(),
  news_link_text: yup.string().required(),

  publication_image: yup.mixed().required(),
  publication_title: yup.string().required(),
  publication_description: yup.string().required(),
  publication_link_text: yup.string().required(),

  event_image: yup.mixed().required(),
  event_title: yup.string().required(),
  event_description: yup.string().required(),
  event_link_text: yup.string().required(),

  report_image: yup.mixed().required(),
  report_title: yup.string().required(),
  report_description: yup.string().required(),
  report_link_text: yup.string().required(),

  gallery_image: yup.mixed().required(),
  gallery_title: yup.string().required(),
  gallery_description: yup.string().required(),
  gallery_link_text: yup.string().required(),
});

export type EventAndMediaContentType = yup.InferType<
  typeof EventAndMediaContentSchema
>;

export default function EventsAndMediaPage() {
  const [newsDescription, setNewsDescription] = useState("");
  const [publicationDescription, setPublicationDescription] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");

  const client = useQueryClient();

  const { isLoading, data } = useQuery(
    "getMediaAndEventContent",
    getMediaAndEventContent,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data) {
          console.log({ data });
        }
      },
    }
  );

  const { isLoading: updateing, mutate } = useMutation(
    updateMediaAndEventContent,
    {
      onSuccess: (data) => {
        toast.success("Media And Event content saved", {
          progressClassName: "toastProgress",
          icon: false,
        });
        client.invalidateQueries("getMediaAndEventContent");
      },
      onError: (error) => {
        toast.error("Media And Event content not edited", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EventAndMediaContentType>({
    resolver: yupResolver(EventAndMediaContentSchema),
    defaultValues: {
      banner_image: "",
      main_image: "",

      news_image: "",
      news_title: "",
      news_description: "",
      news_link_text: "",

      publication_image: "",
      publication_title: "",
      publication_description: "",
      publication_link_text: "",

      event_image: "",
      event_title: "",
      event_description: "",
      event_link_text: "",

      report_image: "",
      report_title: "",
      report_description: "",
      report_link_text: "",

      gallery_image: "",
      gallery_title: "",
      gallery_description: "",
      gallery_link_text: "",
    },
  });

  const onSubmitHandler = (data: EventAndMediaContentType) => {
    const form = new FormData();

    // Helper function to handle image fields
    const appendImage = (key: keyof EventAndMediaContentType) => {
      const value = data[key];
      if (typeof value !== "string" && value instanceof FileList) {
        form.append(key, value[0]);
      }
    };

    // Append all image fields
    appendImage("main_image");
    appendImage("banner_image");
    appendImage("news_image");
    appendImage("publication_image");
    appendImage("event_image");
    appendImage("report_image");
    appendImage("gallery_image");

    // Append string fields
    form.append("news_title", data.news_title);
    form.append("news_description", data.news_description);
    form.append("news_link_text", data.news_link_text);

    form.append("publication_title", data.publication_title);
    form.append("publication_description", data.publication_description);
    form.append("publication_link_text", data.publication_link_text);

    form.append("event_title", data.event_title);
    form.append("event_description", data.event_description);
    form.append("event_link_text", data.event_link_text);

    form.append("report_title", data.report_title);
    form.append("report_description", data.report_description);
    form.append("report_link_text", data.report_link_text);

    form.append("gallery_title", data.gallery_title);
    form.append("gallery_description", data.gallery_description);
    form.append("gallery_link_text", data.gallery_link_text);

    // Submit via mutate
    mutate(form);
  };

  useEffect(() => {
    if (data) {
      // Images
      setValue("banner_image", (data as any)?.banner_image || "");
      setValue("main_image", (data as any)?.main_image || "");
      setValue("news_image", (data as any)?.news_image || "");
      setValue("publication_image", (data as any)?.publication_image || "");
      setValue("event_image", (data as any)?.event_image || "");
      setValue("report_image", (data as any)?.report_image || "");
      setValue("gallery_image", (data as any)?.gallery_image || "");

      // Titles
      setValue("news_title", (data as any)?.news_title || "");
      setValue("publication_title", (data as any)?.publication_title || "");
      setValue("event_title", (data as any)?.event_title || "");
      setValue("report_title", (data as any)?.report_title || "");
      setValue("gallery_title", (data as any)?.gallery_title || "");

      // Descriptions (form + state)
      setValue("news_description", (data as any)?.news_description || "");
      setNewsDescription((data as any)?.news_description || "");

      setValue(
        "publication_description",
        (data as any)?.publication_description || ""
      );
      setPublicationDescription((data as any)?.publication_description || "");

      setValue("event_description", (data as any)?.event_description || "");
      setEventDescription((data as any)?.event_description || "");

      setValue("report_description", (data as any)?.report_description || "");
      setReportDescription((data as any)?.report_description || "");

      setValue("gallery_description", (data as any)?.gallery_description || "");
      setGalleryDescription((data as any)?.gallery_description || "");

      // Link Texts
      setValue("news_link_text", (data as any)?.news_link_text || "");
      setValue(
        "publication_link_text",
        (data as any)?.publication_link_text || ""
      );
      setValue("event_link_text", (data as any)?.event_link_text || "");
      setValue("report_link_text", (data as any)?.report_link_text || "");
      setValue("gallery_link_text", (data as any)?.gallery_link_text || "");
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Loading loading={isLoading || updateing} />
      <h2>Media And Event Content</h2>

      <BoxWithHeading heading="Banner Image">
        <div style={{ margin: "0 10px" }}>
          <img
            src={String(data?.banner_image) ?? ""}
            style={{ width: "75px", height: "75px" }}
            alt=""
          />
          <InputWithLabel
            register={register("banner_image")}
            label="Image (Aspect Ratio: 16/7)"
            type="file"
          />
        </div>
      </BoxWithHeading>

      <BoxWithHeading heading="Main Image">
        <div style={{ margin: "0 10px" }}>
          <img
            src={String(data?.main_image) ?? ""}
            style={{ width: "75px", height: "75px" }}
            alt=""
          />
          <InputWithLabel
            register={register("main_image")}
            label="Image (Aspect Ratio: )"
            type="file"
          />
        </div>
      </BoxWithHeading>

      {/* News Section */}
      <BoxWithHeading heading="News">
        <div style={{ margin: "0 10px" }}>
          <img
            src={String(data?.news_image) ?? ""}
            style={{ width: "75px", height: "75px" }}
            alt=""
          />
          <InputWithLabel
            register={register("news_image")}
            label="Image (Aspect Ratio: )"
            type="file"
          />
        </div>
        <InputWithLabel label="Title" register={register("news_title")} />
        <AdvancedEditor
          value={newsDescription}
          onChange={(newContent: string) => {
            setNewsDescription(newContent);
            setValue("news_description", newContent, { shouldValidate: true });
          }}
        />
        <InputWithLabel
          label="Link Text"
          register={register("news_link_text")}
        />
      </BoxWithHeading>

      {/* Publication Section */}
      <BoxWithHeading heading="Publication">
        <div style={{ margin: "0 10px" }}>
          <img
            src={String(data?.publication_image) ?? ""}
            style={{ width: "75px", height: "75px" }}
            alt=""
          />
          <InputWithLabel
            register={register("publication_image")}
            label="Image (Aspect Ratio: )"
            type="file"
          />
        </div>
        <InputWithLabel
          label="Title"
          register={register("publication_title")}
        />
        <AdvancedEditor
          value={publicationDescription}
          onChange={(newContent: string) => {
            setPublicationDescription(newContent);
            setValue("publication_description", newContent, {
              shouldValidate: true,
            });
          }}
        />
        <InputWithLabel
          label="Link Text"
          register={register("publication_link_text")}
        />
      </BoxWithHeading>

      {/* Event Section */}
      <BoxWithHeading heading="Event">
        <div style={{ margin: "0 10px" }}>
          <img
            src={String(data?.event_image) ?? ""}
            style={{ width: "75px", height: "75px" }}
            alt=""
          />
          <InputWithLabel
            register={register("event_image")}
            label="Image (Aspect Ratio: )"
            type="file"
          />
        </div>
        <InputWithLabel label="Title" register={register("event_title")} />
        <AdvancedEditor
          value={eventDescription}
          onChange={(newContent: string) => {
            setEventDescription(newContent);
            setValue("event_description", newContent, {
              shouldValidate: true,
            });
          }}
        />
        <InputWithLabel
          label="Link Text"
          register={register("event_link_text")}
        />
      </BoxWithHeading>

      {/* Report Section */}
      <BoxWithHeading heading="Report">
        <div style={{ margin: "0 10px" }}>
          <img
            src={String(data?.report_image) ?? ""}
            style={{ width: "75px", height: "75px" }}
            alt=""
          />
          <InputWithLabel
            register={register("report_image")}
            label="Image (Aspect Ratio: )"
            type="file"
          />
        </div>
        <InputWithLabel label="Title" register={register("report_title")} />
        <AdvancedEditor
          value={reportDescription}
          onChange={(newContent: string) => {
            setReportDescription(newContent);
            setValue("report_description", newContent, {
              shouldValidate: true,
            });
          }}
        />
        <InputWithLabel
          label="Link Text"
          register={register("report_link_text")}
        />
      </BoxWithHeading>

      {/* Gallery Section */}
      <BoxWithHeading heading="Gallery">
        <div style={{ margin: "0 10px" }}>
          <img
            src={String(data?.gallery_image) ?? ""}
            style={{ width: "75px", height: "75px" }}
            alt=""
          />
          <InputWithLabel
            register={register("gallery_image")}
            label="Image (Aspect Ratio: )"
            type="file"
          />
        </div>
        <InputWithLabel label="Title" register={register("gallery_title")} />
        <AdvancedEditor
          value={galleryDescription}
          onChange={(newContent: string) => {
            setGalleryDescription(newContent);
            setValue("gallery_description", newContent, {
              shouldValidate: true,
            });
          }}
        />
        <InputWithLabel
          label="Link Text"
          register={register("gallery_link_text")}
        />
      </BoxWithHeading>
      <br />
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
      <Button style={{ width: "100%" }} styleType="pry">
        EDIT
      </Button>
    </form>
  );
}
