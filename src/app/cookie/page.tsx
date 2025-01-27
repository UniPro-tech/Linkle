import { Stack } from "@mui/material";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "クッキーポリシー - Linkle",
    description: "Linkleのクッキーポリシーです。",
}

export default async function TOS() {
    const description = `
# クッキーポリシー
デジタル創作サークルUniProject N/S Branch（以下、「当団体」といいます。）は、お客様のウェブサイト利用状況を分析し、または個々のお客様に対してカスタマイズされたサービス・広告を提供する等の目的のため、クッキーを使用して一定の情報を収集します。

## クッキーについて
クッキーとはお客様のウェブサイト閲覧情報を、そのお客様のコンピューター（PCやスマートフォン、タブレットなどインターネット接続可能な機器）に記憶させる機能のことです。

クッキーには、当団体によって設定されるもの（ファーストパーティークッキー）と、当団体と提携する第三者によって設定されるもの（サードパーティークッキー）があります。

## クッキーの利用目的
当団体では、クッキーを、お客様がウェブサイトを閲覧する際に同じ情報を繰り返し入力することがなくなるなど、お客様の利便性向上のために使用しています。
当団体では、クッキーを使用して収集した情報を利用して、お客様のウェブサイトの利用状況（アクセス状況、トラフィック、ルーティング等）を分析し、ウェブサイト自体のパフォーマンス改善や、当団体からお客様に提供するサービスの向上、改善のために使用することがあります。

また、この分析にあたっては、主に以下のツールが利用され、ツール提供者に情報提供されることがあります。

- Google Analytics
- Google Tag Manager

この他、クッキーは、提携する広告配信サービス提供会社における行動ターゲティング広告の配信に使用される場合があります。
## クッキーの拒否方法
お客様がブラウザの設定を変更することによりクッキーを無効にすることが可能です。ただし、クッキーを無効にした場合は、一部のサービスが受けられない場合があります。
クッキーの設定の変更方法については、各ブラウザの製造元へご確認ください。

## サードパーティクッキーによる送信情報
本サービスでは、アクセス解析と広告配信の目的で、サードパーティークッキーを使用しています。
サードパーティークッキーによる送信情報等は以下のとおりです。
### Google Analytics/Google Tag Manager
#### ツール提供者
Google Inc.
#### 取得する情報
皆様のWebサイトの利用状況（アクセス状況、トラフィック、ルーティング等）
#### 利用目的
利便性の向上やサイトの改善のため

皆様のWebサイトの利用状況については、Google社も取得し、利用します。
詳細については、以下のURLをご確認ください。

- [Google Analytics利用規約（外部サイトへリンク）](https://marketingplatform.google.com/about/analytics/terms/jp/)
- [Google のサービスを使用するサイトやアプリから収集した情報の Google による使用（外部サイトへリンク）](https://policies.google.com/technologies/partner-sites?hl=ja)

google社のプライバシーポリシーについては、以下のとおりです。

- [Googleのプライバシーポリシー（外部サイトへリンク）](https://policies.google.com/privacy?hl=ja)

Google Analyticsに関する情報は、以下のサイトからも入手できます。

- [Google Analyticsに関する詳細情報（外部サイトへリンク）](https://marketingplatform.google.com/about/analytics/)

アナリティクスヘルプ > データのプライバシーとセキュリティ > データの保護
`
    return (
        <Stack flex={1} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} justifyItems={"center"} p={2}>
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} className={"markdown"}>{description}</ReactMarkdown>
        </Stack>
    );
}