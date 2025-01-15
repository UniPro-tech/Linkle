const endpoint = process.env.DB_API_ENDPOINT;

export async function getCurrentUser(email: string) {
    const apiRes = await fetch(`${endpoint}/users?search=${email}`);
    if (apiRes.ok) {
        const users = await apiRes.json();
        return users.records[0];
    } else {
        throw new Error("Failed to fetch user data");
    }
}