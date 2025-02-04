type Club = {
  id: number;
  name: string;
  slack_name: string;
  slack_link: string;
  available_on: number;
  short_description: string;
  long_description: string;
  created_at: string;
  updated_at: string;
  image: string;
  visible: number;
  owner: string[] | undefined;
  image_file: string | undefined;
};

export default Club;
