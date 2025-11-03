import axios from "axios";

export const getTeamPlayers = async (teamId: string) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/team-players`, {
            params: { teamId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching team players:", error);
        throw error;
    }
}
