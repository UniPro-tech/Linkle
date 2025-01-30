"use server";
import { auth } from "@/auth";
import Club from "@/models/Club";

const endpoint = process.env.DB_API_ENDPOINT;

export interface SearchClubsRequest {
    query: string;
}
export interface SearchClubsResponse {
    data: Club[];
    status: string;
}
const searchClubs = async (
    data?: SearchClubsRequest
): Promise<SearchClubsResponse> => {
    const session = await auth();
    const response = await fetch(`${endpoint}/clubs?${data?.query ? `&search=${data.query}` : ""}`);
    const resultRaw = await response.json();
    const result = resultRaw.records as Club[];

    if (session) {
        result.filter((club) => {
            return (club.visible & 0x1) == 0x1;
        });
    } else {
        result.filter((club) => {
            return (club.visible & 0x2) == 0x2;
        });
    }

    return {
        status: "200",
        data: result,
    };
};
export default searchClubs;

export const getClubById = async (id: string): Promise<SearchClubsResponse> => {
    const response = await fetch(`${endpoint}/clubs/?filter1=id,eq,${id}`);
    const result = await response.json();
    return {
        status: "200",
        data: result.records,
    };
}