import axios from "axios";

export const deleteLeagueMember = async (leagueId: string, userId: string) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.delete(`${apiUrl}/league-members/${leagueId}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting league member:", error);
        throw error;
    }
}
