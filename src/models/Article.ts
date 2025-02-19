type Article = {
  id: number;
  title: string;
  authors: string[] | undefined;
  clubs: number[] | undefined;
  description: string;
  main_text: string;
  created_at: string;
  updated_at: string;
  image: string;
  image_file: string | undefined;
  visible: number;
};

export default Article;
