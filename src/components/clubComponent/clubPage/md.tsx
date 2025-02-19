import { Stack } from "@mui/material";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export function LongDescription({ description }: { description: string }) {
  return (
    <Stack
      flex={1}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      justifyItems={"center"}
      width={"100%"}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        className={"markdown"}
      >
        {description}
      </ReactMarkdown>
    </Stack>
  );
}
