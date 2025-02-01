"use server";

import Club from "@/models/Club";

const endpoint = process.env.DB_API_ENDPOINT;

export interface SearchClubsResponse {
    data: Club[];
    status: string;
}

export const getMyClub = async (email: string): Promise<SearchClubsResponse> => {
    const response = await fetch(`${endpoint}/user_club/?filter1=user,eq,${email}&join=club,clubs`);
    const result = await response.json();
    const result2 = result.records.map((record: { club: Club[] }) => {
        return record.club;
    });
    return {
        status: "200",
        data: result2,
    };
}

export const isOwner = async (email: string, clubId: number | string): Promise<boolean> => {
    const response = await fetch(`${endpoint}/user_club/?filter1=user,eq,${email}&filter2=club,eq,${clubId}`);
    const result = await response.json();
    return result.records.length > 0;
}