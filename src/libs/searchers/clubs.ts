"use server";
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
    data: SearchClubsRequest
): Promise<SearchClubsResponse> => {
    console.log(data);
    const response = await fetch(`${endpoint}/clubs?search=${data.query}`);
    const resultRaw = await response.json();
    const result = resultRaw.records;
    return {
        status: "200",
        data: result,
    };
};
export default searchClubs;

