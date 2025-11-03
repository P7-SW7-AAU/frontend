import axios from "axios";

export const getPlayers = async () => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(apiUrl + "/players");
        return response.data;
    } catch (error) {
        console.error("Error fetching players:", error);
        throw error;
    }
}
