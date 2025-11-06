import axios from "axios";

export const getTeams = async (userId: string, accessToken: string) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/teams/user/${userId}`, {
            headers: { "x-stack-access-token": accessToken }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching teams:", error);
        throw error;
    }
}

export const createTeam = async (data: any, api: any) => {
    try {
        const response = await api.post("/teams", data);
        return response.data;
    } catch (error) {
        console.error("Error creating team:", error);
        throw error;
    }
}

export const updateTeam = async (teamId: string, data: any, api: any) => {
    try {
        const response = await api.patch(`/teams/${teamId}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating team:", error);
        throw error;
    }
}

export const deleteTeam = async (teamId: string, api: any) => {
    try {
        const response = await api.delete(`/teams/${teamId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting team:", error);
        throw error;
    }
}
