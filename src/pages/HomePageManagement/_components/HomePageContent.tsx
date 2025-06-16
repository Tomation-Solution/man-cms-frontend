import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Button from "../../../components/Button/Button";
import {
  getHomePageContent,
  updateHomePageContent,
} from "../../../axios/api-calls";
import Loading from "../../../components/Loading/Loading";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputWithLabel from "../../../components/InputWithLabel/InputWithLabel";
import BoxWithHeading from "../../../components/BoxWithHeading";
import { useForm } from "react-hook-form";
import AdvancedEditor from "../../../components/TextEditor/AdvancedQuill";

const HomePageContentSchema = yup.object({
  slider_welcome_message: yup.string().required(),
  slider_vision_message: yup.string().required(),
  slider_mission_message: yup.string().required(),

  vision_intro: yup.string().required(),
  mission_intro: yup.string().required(),
  advocacy_intro: yup.string().required(),

  history_intro: yup.string().required(),
  why_join_intro: yup.string().required(),
  members_intro: yup.string().required(),

  Logo: yup.mixed(),
  slider_image1: yup.mixed(),
  slider_image2: yup.mixed(),
  slider_image3: yup.mixed(),

  history_image: yup.mixed(),
  join_man_image: yup.mixed(),
});

export type HomePageContentType = yup.InferType<typeof HomePageContentSchema>;

const HomePageContent = () => {
  const [visionIntro, setVisionIntro] = useState("");
  const [missionIntro, setMissionIntro] = useState("");
  const [advocacyIntro, setAdvocacyIntro] = useState("");

  const [historyIntro, setHistoryIntro] = useState("");
  const [whyJoinIntro, setWhyJoinIntro] = useState("");
  const [membersIntro, setMembersIntro] = useState("");

  const client = useQueryClient();
  const { isLoading, data } = useQuery(
    "getHomePageContent",
    getHomePageContent,
    {
      onSuccess: (data) => {
        if (data) {
          console.log({ data });
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: updateing, mutate } = useMutation(updateHomePageContent, {
    onSuccess: (data) => {
      toast.success("home page content saved", {
        progressClassName: "toastProgress",
        icon: false,
      });
      client.invalidateQueries("getHomePageContent");
    },
    onError: (error) => {
      toast.error("ome page content not edited", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HomePageContentType>({
    resolver: yupResolver(HomePageContentSchema),
  });

  const onSubmitHandler = (data: HomePageContentType) => {
    console.log({ SUbmittedData: data });
    mutate(data);
    // setVisionIntro("");
    // setMissionIntro("");
    // setAdvocacyIntro("");
    // setHistoryIntro("");
    // setWhyJoinIntro("");
    // setMembersIntro("");
  };

  useEffect(() => {
    if (data) {
      setValue("Logo", data.Logo);
      setValue("slider_image1", data.slider_image1);
      setValue("slider_image2", data.slider_image2);
      setValue("slider_image3", data.slider_image3);
      setValue("history_image", data.history_image);
      setValue("join_man_image", data.join_man_image);

      setValue("slider_welcome_message", data.slider_welcome_message);
      setValue("slider_vision_message", data.slider_vision_message);
      setValue("slider_mission_message", data.slider_mission_message);

      setValue("vision_intro", data.vision_intro);
      setValue("mission_intro", data.mission_intro);
      setValue("advocacy_intro", data.advocacy_intro);
      setValue("history_intro", data.history_intro);
      setValue("why_join_intro", data.why_join_intro);
      setValue("members_intro", data.members_intro);

      setVisionIntro(data.vision_intro);
      setMissionIntro(data.mission_intro);
      setAdvocacyIntro(data.advocacy_intro);
      setHistoryIntro(data.history_intro);
      setWhyJoinIntro(data.why_join_intro);
      setMembersIntro(data.members_intro);
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Loading loading={isLoading || updateing} />
      <h2>Home Page Content</h2>
      <InputWithLabel
        label="Slider Welcome Message"
        register={register("slider_welcome_message")}
      />

      <InputWithLabel
        label="Slider Vision Message"
        register={register("slider_vision_message")}
      />

      <InputWithLabel
        label="Slider Mission Message"
        register={register("slider_mission_message")}
      />
      <BoxWithHeading heading="Vision Intro">
        <AdvancedEditor
          value={visionIntro}
          onChange={(newContent: string) => {
            setVisionIntro(newContent);
            setValue("vision_intro", newContent, {
              shouldValidate: true,
            });
          }}
        />
      </BoxWithHeading>

      <BoxWithHeading heading="Mission Intro">
        <AdvancedEditor
          value={missionIntro}
          onChange={(newContent: string) => {
            setMissionIntro(newContent);
            setValue("mission_intro", newContent, {
              shouldValidate: true,
            });
          }}
        />
      </BoxWithHeading>

      <BoxWithHeading heading="Advocacy Intro">
        <AdvancedEditor
          value={advocacyIntro}
          onChange={(newContent: string) => {
            setAdvocacyIntro(newContent);
            setValue("advocacy_intro", newContent, {
              shouldValidate: true,
            });
          }}
        />
      </BoxWithHeading>

      <BoxWithHeading heading="History Intro">
        <AdvancedEditor
          value={historyIntro}
          onChange={(newContent: string) => {
            setHistoryIntro(newContent);
            setValue("history_intro", newContent, {
              shouldValidate: true,
            });
          }}
        />
      </BoxWithHeading>

      <BoxWithHeading heading="Why Join Intro">
        <AdvancedEditor
          value={whyJoinIntro}
          onChange={(newContent: string) => {
            setWhyJoinIntro(newContent);
            setValue("why_join_intro", newContent, {
              shouldValidate: true,
            });
          }}
        />
      </BoxWithHeading>

      <BoxWithHeading heading="Members Intro">
        <AdvancedEditor
          value={membersIntro}
          onChange={(newContent: string) => {
            setMembersIntro(newContent);
            setValue("members_intro", newContent, {
              shouldValidate: true,
            });
          }}
        />
      </BoxWithHeading>

      <div style={{ margin: "0 10px" }}>
        <img
          src={data?.Logo}
          style={{ width: "75px", height: "75px" }}
          alt=""
        />
        <InputWithLabel register={register("Logo")} label="Logo" />
      </div>

      <div style={{ margin: "0 10px" }}>
        <img
          src={data?.slider_image1 ?? ""}
          style={{ width: "75px", height: "75px" }}
          alt=""
        />
        <InputWithLabel
          register={register("slider_image1")}
          label="slider image"
          type="file"
        />
      </div>

      <div style={{ margin: "0 10px" }}>
        <img
          src={data?.slider_image2 ?? ""}
          style={{ width: "75px", aspectRatio: "33.5/10" }}
          alt=""
        />
        <InputWithLabel
          register={register("slider_image2")}
          label="Our Vision Image (Recommended: 670x200px, Aspect Ratio 33.5:10)"
          type="file"
        />
      </div>

      <div style={{ margin: "0 10px" }}>
        <img
          src={data?.history_image ?? ""}
          style={{ width: "75px", aspectRatio: "33.5/10" }}
          alt=""
        />
        <InputWithLabel
          register={register("history_image")}
          label="Our History Image (Recommended: 670x200px, Aspect Ratio 33.5:10)"
          type="file"
        />
      </div>

      <div style={{ margin: "0 10px" }}>
        <img
          src={data?.join_man_image ?? ""}
          style={{ width: "75px", aspectRatio: "33.5/10" }}
          alt=""
        />
        <InputWithLabel
          register={register("join_man_image")}
          label="Why Join Man Image (Recommended: 670x200px, Aspect Ratio 33.5:10)"
          type="file"
        />
      </div>

      <div style={{ margin: "0 10px" }}>
        <img
          src={data?.slider_image3 ?? ""}
          style={{ width: "75px", aspectRatio: "16/10" }}
          alt=""
        />
        <InputWithLabel
          register={register("slider_image3")}
          label="lastest update image (Recommended: 800x500px, Aspect Ratio 16:10)"
          type="file"
        />
      </div>

      <Button style={{ width: "100%" }} styleType="pry">
        EDIT
      </Button>
    </form>
  );
};

export default HomePageContent;
