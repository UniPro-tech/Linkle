import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "プライバシーポリシー - Linkle",
    description: "Linkleのプライバシーポリシーです。",
}

export default function PrivacyPage() {
    redirect("https://wiki.uniproject.jp/share/6777b30da69c94671306a70c");
}