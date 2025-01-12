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
    // for test
    /*const result = [
        {
            id: 1,
            name: "同好会1",
            slack_name: "slack_name1",
            slack_link: "slack_link1",
            available_on: 0x2,
            short_description: "短い説明",
            long_description: "同好会1の説明",
            created_at: "2021-10-01",
            updated_at: "2021-10-01",
            image: "/img/test.jpg",
        },
        {
            id: 2,
            name: "同好会2",
            slack_name: "slack_name2",
            slack_link: "slack_link2",
            available_on: 0x1,
            short_description: "短い説明",
            long_description: "同好会2の説明",
            created_at: "2021-10-01",
            updated_at: "2021-10-01",
            image: "https://example.com/image.jpg",
        },
        {
            id: 2,
            name: "同好会2",
            slack_name: "slack_name2",
            slack_link: "slack_link2",
            available_on: 0x1 | 0x2,
            short_description: "短い説明",
            long_description: "同好会2の説明",
            created_at: "2021-10-01",
            updated_at: "2021-10-01",
            image: "https://example.com/image.jpg",
        },
        {
            id: 2,
            name: "同好会2",
            slack_name: "slack_name2",
            slack_link: "slack_link2",
            available_on: 0x0,
            short_description: "短い説明",
            long_description: "同好会2の説明",
            created_at: "2021-10-01",
            updated_at: "2021-10-01",
            image: "https://example.com/image.jpg",
        },
        {
            id: 1,
            name: "同好会1",
            slack_name: "slack_name1",
            slack_link: "slack_link1",
            available_on: 0x2,
            short_description: "短い説明",
            long_description: "同好会1の説明",
            created_at: "2021-10-01",
            updated_at: "2021-10-01",
            image: "/img/test.jpg",
        },
        {
            id: 2,
            name: "同好会2",
            slack_name: "slack_name2",
            slack_link: "slack_link2",
            available_on: 0x1,
            short_description: "短い説明",
            long_description: "同好会2の説明",
            created_at: "2021-10-01",
            updated_at: "2021-10-01",
            image: "https://example.com/image.jpg",
        },
        {
            id: 2,
            name: "同好会2",
            slack_name: "slack_name2",
            slack_link: "slack_link2",
            available_on: 0x1 | 0x2,
            short_description: "短い説明",
            long_description: "同好会2の説明",
            created_at: "2021-10-01",
            updated_at: "2021-10-01",
            image: "https://example.com/image.jpg",
        },
        {
            id: 2,
            name: "同好会2",
            slack_name: "slack_name2",
            slack_link: "slack_link2",
            available_on: 0x0,
            short_description: "短い説明",
            long_description: "同好会2の説明",
            created_at: "2021-10-01",
            updated_at: "2021-10-01",
            image: "https://example.com/image.jpg",
        },
    ];
    */
    return {
        status: "200",
        data: result,
    };
};
export default searchClubs;

