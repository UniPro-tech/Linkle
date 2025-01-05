enum AvailableOn {
    Chutobu = "Chutobu",
    HighSchool = "HighSchool",
}

type Club = {
    id: number;
    name: string;
    slack_name: string;
    slack_link: string;
    available_on: AvailableOn;
    short_description: string;
    long_description: string;
    created_at: string;
    updated_at: string;
    image: string;
};

export default Club;