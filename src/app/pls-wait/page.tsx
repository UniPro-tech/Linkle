import { Metadata } from "next";
import PlsWaitPage from "./component";

export const metadata: Metadata = {
    title: "リリースまでお待ちください - Linkle",
    description: "Please wait until the service starts.",
}

export default function PlsWait() {
    return (
        <PlsWaitPage />
    );
}