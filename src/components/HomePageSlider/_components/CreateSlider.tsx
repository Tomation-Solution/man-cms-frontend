import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createHomeSliderApi,
  editHomeSliderApi,
} from "../../../axios/api-calls";
import { toast } from "react-toastify";
import { Form } from "../../../globals/styles/forms.styles";
import Loading from "../../Loading/Loading";
import InputWithLabel from "../../InputWithLabel/InputWithLabel";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "../../Button/Button";

const createSliderschema = yup.object({
  title: yup.string().required(),
  banner: yup.mixed(),
  content: yup.string().required(),
  id: yup.number(),
  order_position: yup.number().positive().integer(),
});

export type createSliderschemaType = yup.InferType<typeof createSliderschema>;

const CreateSlider = ({
  sliderInstance,
}: {
  sliderInstance?: createSliderschemaType;
}) => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState(sliderInstance?.content || "");

  const {
    register,
    handleSubmit, // No need for control here since you're not using Controller
    setValue,
    formState: { errors },
  } = useForm<createSliderschemaType>({
    resolver: yupResolver(createSliderschema),
  });

  const { mutate: create, isLoading: creating } = useMutation(
    createHomeSliderApi,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getHomeSliderApi");
        toast.success("Slider Created!", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
    }
  );

  const { mutate: update, isLoading: updating } = useMutation(
    editHomeSliderApi,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getHomeSliderApi");
        toast.success("Slider Updated!", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
    }
  );

  const onSubmitHandler = (data: createSliderschemaType) => {
    // Update the content from ReactQuill before submitting
    const updatedData = { ...data, content };

    if (sliderInstance) {
      update({
        ...updatedData,
        banner: data.banner ? data.banner[0] : undefined,
      });
    } else {
      create({ ...updatedData, banner: data.banner[0] });
    }
  };

  useEffect(() => {
    if (sliderInstance) {
      setValue("content", content);
      setValue("title", sliderInstance.title);
      setValue("id", sliderInstance.id);
      setValue("order_position", sliderInstance.order_position);
    }
  }, [sliderInstance, setValue, content]);

  return (
    <Form onSubmit={handleSubmit(onSubmitHandler)}>
      <Loading loading={creating || updating} />
      <h2 style={{ padding: "1rem 0" }}>
        {sliderInstance ? "Update Slider" : "Create Slider"}
      </h2>
      <br />
      <br />
      <InputWithLabel
        label="Title"
        register={register("title")}
        errorMessage={errors.title?.message}
      />
      <InputWithLabel
        label="Display Order"
        type="number"
        placeholder="Lower numbers appear first."
        register={register("order_position")}
        errorMessage={errors.order_position?.message}
      />
      <label style={{ fontWeight: 600 }}>Content</label>
      <ReactQuill
        style={{ background: "white", color: "black", marginBottom: "1.5rem" }}
        value={content}
        onChange={(newContent) => {
          setContent(newContent);
          setValue("content", newContent, { shouldValidate: true }); // Updates the form field and triggers validation
        }}
      />
      <InputWithLabel
        type="file"
        label="Banner"
        register={register("banner")}
      />
      <Button styleType="whiteBg">
        {sliderInstance ? "Update" : "Create"}
      </Button>
    </Form>
  );
};

export default CreateSlider;
