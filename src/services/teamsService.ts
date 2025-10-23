export const createTeam = async (data: any, api: any) => {
    try {
        const response = await api.post("/teams", data);
        return response.data;
    } catch (error) {
        console.error("Error creating team:", error);
        throw error;
    }
}
