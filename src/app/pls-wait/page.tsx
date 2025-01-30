"use client"
import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const calculateTimeLeft = () => {
    const difference = +new Date("2025-01-31T04:00:00Z") - +new Date();
    let timeLeft: { [key: string]: number } = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    return timeLeft;
};

export default function PlsWaitPage() {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents: React.ReactNode[] = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
        }

        timerComponents.push(
            <span key={interval}>
                {timeLeft[interval]} {interval}{" "}
            </span>
        );
    });

    return (
        <Stack justifyContent="center" alignItems="center" justifyItems={"center"} height="100vh" spacing={2}>
            {timerComponents.length ?
                <>
                    <Typography variant="h2">Please wait...</Typography>
                    <Typography variant="h5">リリースまで {timerComponents}</Typography>
                </>
                :
                <>
                    <Typography variant="h2">Linkleサービススタート開始！！</Typography>
                    <Typography variant="h4">ぜひログインしてお使いください。 {timerComponents}</Typography>
                    <Button variant="contained" color="primary" href="/signin">ログイン</Button>
                </>}
        </Stack>
    );
}
