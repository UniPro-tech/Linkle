"use server";

import Club from "@/models/Club";

const endpoint = process.env.DB_API_ENDPOINT;

export interface SearchClubsResponse {
    data: Club[];
    status: string;
}

export const getMyClub = async (email: string): Promise<SearchClubsResponse> => {
    const response = await fetch(`${endpoint}/user_club/?filter1=user,eq,${email}`);
    const result = await response.json();
    return {
        status: "200",
        data: result.records,
    };
}

export const isOwner = async (email: string, clubId: number | string): Promise<boolean> => {
    const response = await fetch(`${endpoint}/user_club/?filter1=user,eq,${email}&filter2=club,eq,${clubId}`);
    const result = await response.json();
    return result.records.length > 0;
}