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
    data?: SearchClubsRequest
): Promise<SearchClubsResponse> => {
    console.log(data);
    const response = await fetch(`${endpoint}/clubs?${data?.query?`&search=${data.query}`:""}`);
    const resultRaw = await response.json();
    const result = resultRaw.records;
    // for test
    /*
    const result = [
        {
            id: 1,
            name: "ぬっこ同好会",
            slack_name: "ぬっこ同好会",
            slack_link: "C07LVRAALHF",
            available_on: 0x3,
            short_description: "ねこって可愛いですよね？(圧)\n猫を愛し猫を吸い猫についての情報共有をする同好会です！！",
            long_description: `
# ぬっこ同好会

こんにちは！ぬっこ同好会です。
私たちは、 **猫を愛し、猫を吸い、猫のため(信仰)** 日々活動しています！

## 活動内容

普段はSlackのチャンネルで猫の写真を送ったり動画を送ったり関連する情報を交換しあったりしています。

定例会などはこれといって開催していませんが、何かしらネタができたら開催するかもしれません。
`,
            created_at: "2021-10-01",
            updated_at: "2021-10-01",
            image: "/img/test2.jpg",
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
    ];*/

    return {
        status: "200",
        data: result,
    };
};
export default searchClubs;

