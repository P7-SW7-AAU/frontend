import axios from "axios";

export const getLeagues = async (accessToken: string) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/leagues/my-leagues`, {
            headers: { "x-stack-access-token": accessToken }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching leagues:", error);
        throw error;
    }
}

export const createLeague = async (data: any, api: any) => {
    try {
        const response = await api.post("/leagues", data);
        return response.data;
    } catch (error) {
        console.error("Error creating league:", error);
        throw error;
    }
}

// -- INSERT updateLeague FUNCTION HERE --

export const deleteLeague = async (leagueId: string, api: any) => {
    try {
        const response = await api.delete(`/leagues/${leagueId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting league:", error);
        throw error;
    }
}
