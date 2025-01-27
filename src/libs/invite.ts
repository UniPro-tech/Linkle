const endpoint = process.env.DB_API_ENDPOINT;
export const getInvite = async (email: string, password: string) => {
    const res = await fetch(`${endpoint}/invite?search=${password}`);
    if (!res.ok) {
        return null;
    } else {
        const dataBefore = await res.json();
        if (dataBefore.records.length === 0) {
            return null;
        }
        await fetch(`${endpoint}/invite/${dataBefore.records[0].id}`, {
            method: "PATCH",
            body: JSON.stringify({ email: email, status: "used" }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const res2 = await fetch(`${endpoint}/invite?search=${password}`);
        const data = await res2.json();
        return data.records[0];
    }
}