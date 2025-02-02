import { Stack } from "@mui/material";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "このサイトについて - Linkle",
  description: "Linkleについての説明です。",
};

export default async function TOS() {
  const description = `
# Linkle制作にあたって

みなさんこんにちは！
デジタル創作サークルUniProjectのあかつきゆいとです。

## Linkleとは

Linkleは、角川ドワンゴ学園内の同好会をより検索しやすく、より楽しめるようにするために制作されたウェブサイトです。

### スプレッドシートの課題

現行のスプレッドシートには、以下のような課題がありました。

- 検索がしにくい
- パッと見でどのような同好会があるのかがわかりにくい
- 画像がない
- 気軽に説明を変更できない

などなど...

このLinkleでは、これらの課題を解決し、より使いやすい同好会検索サイトを目指しています。

## このサイトの機能

このサイトでは、以下の機能を提供しています。

- 同好会の検索
- 同好会の一覧表示
- 同好会の詳細表示

## 今後の展望

このサイトは、まだまだ未完成です。
今後は、以下のような機能を追加していく予定です。

- 同好会からのお知らせ(イベント告知等・未実装)
- 同好会のおすすめ(ランダム表示等・未実装)
- デザインの改善
- パフォーマンスの改善
- タグ付け機能
- お気に入り機能
- 参加ユーザー一覧
などなど...

## 最後に

最後になりましたが、ご利用者の皆様、同好会の皆様、関係者の皆様には、このサイトをご利用いただき、誠にありがとうございます。
そして、ともにこのサイトをより良いものにしていくために、ご意見、ご要望、バグ報告などをお寄せいただけると幸いです。

これからもよろしくお願いします。

2025年1月31日 あかつきゆいと
`;
  return (
    <Stack
      flex={1}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      justifyItems={"center"}
      p={2}
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
