import Club from "./Club";

type Event = {
  id: number;
  title: string;
  authors: string[] | undefined;
  clubs: Club[] | undefined;
  description: string;
  main_text: string;
  created_at: string;
  updated_at: string;
  image: string;
  image_file: string | undefined;
  visible: number;
  start_at: Date;
  end_at: Date;
};

export default Event;
