import axios, { AxiosInstance } from "axios";

export const deleteLeagueMember = async (leagueId: string, api: AxiosInstance) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await api.delete(`${apiUrl}/league-members/${leagueId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting league member:", error);
        throw error;
    }
}
