import { string } from "yup";

export type AGMHomepageType = {
  id: number;
  main_image: string;
  intro_text: string;
  location: string;
  agm_start_date: string;
  countdown_text: string;
  intro_title: string;
  intro_description: string;
  exhibition_text: string;
  exhibition_image: string;
  save_date_text: string;
  save_date_image: string;
  venue_text: string;
  venue_text_image: string;
  created_at: string;
  updated_at: string;
};

export type AGMProgrmType = {
  id: number;
  program_date: string;
  program_title: string;
  program_attached_file_link: string;
  program_attached_file1: any;
  program_attached_file2: any;
  created_at: string;
  updated_at: string;
};

export type AGMSpeakerType = {
  id: number;
  intro_text: string;
  header: string;
  speaker_title: string;
  speaker_name: string;
  extra_title: string;
  speaker_image: string;
  speaker_words: string;
  created_at: string;
  updated_at: string;
};

export type AGMVenueType = {
  id: number;
  venue_image: string;
  venue_location_text: string;
  venue_location_map: string;
  created_at: string;
  updated_at: string;
};

export type AGMExhibitionType = {
  id: number;
  main_image: string;
  intro_text: string;
  created_at: string;
  updated_at: string;
};

export type AGMFaqType = {
  id: number;
  header: string;
  content: string;
  created_at: string;
  updated_at: string;
};
